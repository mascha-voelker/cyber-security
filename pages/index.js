import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/course')
  }, [router])

  return <div>Redirecting to course...</div>
}