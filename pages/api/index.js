import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cyber Security Training</title>
      </Head>
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="/story.html" 
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none' 
          }}
          title="Cyber Security Course"
        />
      </div>
    </>
  )
}