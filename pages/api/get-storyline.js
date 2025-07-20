import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const storyPath = path.join(process.cwd(), 'public', 'story.html')
    const content = fs.readFileSync(storyPath, 'utf8')
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(content)
  } catch (error) {
    console.error('Error reading story.html:', error)
    res.status(500).json({ error: 'Could not load course content' })
  }
}