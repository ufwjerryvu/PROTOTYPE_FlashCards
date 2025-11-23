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
  category?: string
  createdAt: string
}

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [newCard, setNewCard] = useState({ question: '', answer: '', category: '' })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
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
      setNewCard({ question: '', answer: '', category: '' })
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

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL flashcards? This cannot be undone!')) {
      return
    }
    try {
      await fetch('/api/flashcards', { method: 'DELETE' })
      fetchFlashcards()
      setCurrentIndex(0)
      setShowAnswer(false)
    } catch (error) {
      console.error('Error deleting all flashcards:', error)
    }
  }

  const renderContent = (text: string) => (
    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
      {text}
    </ReactMarkdown>
  )

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
    setShowAnswer(false)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
    setShowAnswer(false)
  }

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentIndex(0)
    setShowAnswer(false)
  }

  const categories = Array.from(new Set(flashcards.map(card => card.category || 'Uncategorized')))
  const filteredCards = selectedCategory === 'all'
    ? flashcards
    : flashcards.filter(card => (card.category || 'Uncategorized') === selectedCategory)

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
          {flashcards.length > 0 && (
            <>
              <button className="shuffle-btn" onClick={shuffleCards}>
                🔀 Shuffle
              </button>
              <button className="delete-all-btn" onClick={handleDeleteAll}>
                🗑️ Delete All
              </button>
            </>
          )}
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
            <div className="form-group">
              <label>Category (optional)</label>
              <input
                type="text"
                value={newCard.category}
                onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                placeholder="E.g., Math, Science, History"
              />
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
                placeholder={`[\n  {"question": "What is $E = mc^2$?", "answer": "Einstein's mass-energy equivalence", "category": "Physics"},\n  {"question": "Solve $$x^2 = 4$$", "answer": "$$x = \\\\pm 2$$", "category": "Math"}\n]`}
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
          <div className="category-filter">
            <label>Filter by category:</label>
            <select value={selectedCategory} onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentIndex(0)
              setShowAnswer(false)
            }}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="card-counter">
            Card {currentIndex + 1} of {filteredCards.length}
          </div>

          <div
            className={`flashcard ${showAnswer ? 'flipped' : ''}`}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="flashcard-content">
              {!showAnswer ? (
                <div className="question">
                  <div className="label">Question</div>
                  <div className="text">{renderContent(filteredCards[currentIndex].question)}</div>
                </div>
              ) : (
                <div className="answer">
                  <div className="label">Answer</div>
                  <div className="text">{renderContent(filteredCards[currentIndex].answer)}</div>
                  {filteredCards[currentIndex].category && (
                    <div className="category-badge">
                      {filteredCards[currentIndex].category}
                    </div>
                  )}
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

          <button onClick={() => handleDeleteCard(filteredCards[currentIndex].id)} className="delete-btn">
            🗑️ Delete Card
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <p>Made by Jerry (actually ChatGPT).</p>
        </div>
      )}
    </div>
  )
}
