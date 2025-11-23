import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'Flashcards app with LaTeX and Markdown support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
