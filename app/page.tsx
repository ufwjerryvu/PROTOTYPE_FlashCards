'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

type Flashcard = {
  id: number
  question: string
  answer: string
  createdAt: string
}

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [newCard, setNewCard] = useState({ question: '', answer: '' })
  const [bulkJson, setBulkJson] = useState('')
  const [bulkError, setBulkError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const fetchFlashcards = async () => {
    try {
      const res = await fetch('/api/flashcards')
      const data = await res.json()
      setFlashcards(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching flashcards:', error)
      setLoading(false)
    }
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard)
      })
      setNewCard({ question: '', answer: '' })
      setShowForm(false)
      fetchFlashcards()
    } catch (error) {
      console.error('Error adding flashcard:', error)
    }
  }

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setBulkError('')

    try {
      const parsed = JSON.parse(bulkJson)

      if (!Array.isArray(parsed)) {
        setBulkError('JSON must be an array of objects')
        return
      }

      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      })

      const result = await res.json()
      setBulkJson('')
      setShowBulkForm(false)
      fetchFlashcards()
      alert(result.message || 'Flashcards imported successfully!')
    } catch (error) {
      if (error instanceof SyntaxError) {
        setBulkError('Invalid JSON format')
      } else {
        setBulkError('Error importing flashcards')
      }
      console.error('Error bulk importing:', error)
    }
  }

  const handleDeleteCard = async (id: number) => {
    try {
      await fetch(`/api/flashcards/${id}`, { method: 'DELETE' })
      fetchFlashcards()
      if (currentIndex >= flashcards.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1))
      }
      setShowAnswer(false)
    } catch (error) {
      console.error('Error deleting flashcard:', error)
    }
  }

  const renderContent = (text: string) => (
    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
      {text}
    </ReactMarkdown>
  )

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    setShowAnswer(false)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setShowAnswer(false)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>✨ Flashcards</h1>
        <div className="header-buttons">
          <button
            className="add-btn"
            onClick={() => {
              setShowForm(!showForm)
              setShowBulkForm(false)
            }}
          >
            {showForm ? '✕ Close' : '+ Add Card'}
          </button>
          <button
            className="bulk-btn"
            onClick={() => {
              setShowBulkForm(!showBulkForm)
              setShowForm(false)
            }}
          >
            {showBulkForm ? '✕ Close' : '📦 Bulk Import'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleAddCard} className="flashcard-form">
            <div className="form-group">
              <label>Question (Markdown & LaTeX supported)</label>
              <textarea
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                placeholder="E.g., **What is the quadratic formula?** $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$"
                required
              />
              {newCard.question && (
                <div className="preview">
                  <strong>Preview:</strong>
                  <div>{renderContent(newCard.question)}</div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Answer (Markdown & LaTeX supported)</label>
              <textarea
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                placeholder="E.g., $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$"
                required
              />
              {newCard.answer && (
                <div className="preview">
                  <strong>Preview:</strong>
                  <div>{renderContent(newCard.answer)}</div>
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn">
              Add Flashcard
            </button>
          </form>
        </div>
      )}

      {showBulkForm && (
        <div className="form-container">
          <form onSubmit={handleBulkImport} className="flashcard-form">
            <div className="form-group">
              <label>JSON Array (paste your flashcards array here)</label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder={`[\n  {"question": "What is $E = mc^2$?", "answer": "Einstein's mass-energy equivalence"},\n  {"question": "Solve $$x^2 = 4$$", "answer": "$$x = \\\\pm 2$$"}\n]`}
                required
                rows={15}
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
              {bulkError && (
                <div className="error-message">
                  <strong>Error:</strong>
                  <pre>{bulkError}</pre>
                </div>
              )}
              <div className="help-text">
                <strong>Format:</strong> Array of objects with "question" and "answer" fields. Markdown & LaTeX
                supported.
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Import All Flashcards
            </button>
          </form>
        </div>
      )}

      {flashcards.length > 0 ? (
        <div className="flashcard-container">
          <div className="card-counter">
            Card {currentIndex + 1} of {flashcards.length}
          </div>

          <div
            className={`flashcard ${showAnswer ? 'flipped' : ''}`}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="flashcard-content">
              {!showAnswer ? (
                <div className="question">
                  <div className="label">Question</div>
                  <div className="text">{renderContent(flashcards[currentIndex].question)}</div>
                </div>
              ) : (
                <div className="answer">
                  <div className="label">Answer</div>
                  <div className="text">{renderContent(flashcards[currentIndex].answer)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="controls">
            <button onClick={prevCard} className="nav-btn">
              ← Previous
            </button>
            <button onClick={() => setShowAnswer(!showAnswer)} className="flip-btn">
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </button>
            <button onClick={nextCard} className="nav-btn">
              Next →
            </button>
          </div>

          <button onClick={() => handleDeleteCard(flashcards[currentIndex].id)} className="delete-btn">
            🗑️ Delete Card
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <p>No flashcards yet! Click "Add Card" to create your first one.</p>
        </div>
      )}
    </div>
  )
}
