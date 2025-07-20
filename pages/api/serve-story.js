import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'story.html')
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(fileContent)
  } catch (error) {
    console.error('Error serving story.html:', error)
    res.status(404).json({ error: 'File not found' })
  }
}