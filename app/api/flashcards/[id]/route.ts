import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { question, answer, category } = body

    const flashcard = await prisma.flashcard.update({
      where: { id: parseInt(id) },
      data: { question, answer, category }
    })
    return NextResponse.json(flashcard)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update flashcard' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.flashcard.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete flashcard' }, { status: 500 })
  }
}
