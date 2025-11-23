import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(flashcards)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Check if bulk import (array)
    if (Array.isArray(body)) {
      const flashcards = await prisma.flashcard.createMany({
        data: body
      })
      return NextResponse.json({
        message: `Successfully created ${flashcards.count} flashcards`,
        count: flashcards.count
      }, { status: 201 })
    }

    // Single flashcard
    const { question, answer, category } = body
    const flashcard = await prisma.flashcard.create({
      data: { question, answer, category }
    })
    return NextResponse.json(flashcard, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create flashcard' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await prisma.flashcard.deleteMany({})
    return NextResponse.json({ message: 'All flashcards deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete flashcards' }, { status: 500 })
  }
}
