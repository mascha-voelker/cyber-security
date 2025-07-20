import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Storyline file
    window.location.href = '/story.html'
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Loading Cyber Security Course...</h2>
      <p>If you're not redirected automatically, <a href="/story.html">click here</a></p>
    </div>
  )
}