import { useState, useEffect } from 'react'

export default function Course() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the story.html content
    fetch('/api/get-storyline')
      .then(response => response.text())
      .then(html => {
        setContent(html)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading course:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading course...</div>
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}