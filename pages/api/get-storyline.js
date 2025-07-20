import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    // Let's see what files are actually available
    const publicDir = path.join(process.cwd(), 'public')
    const storyPath = path.join(process.cwd(), 'public', 'story.html')
    
    console.log('Looking for story.html at:', storyPath)
    console.log('Public directory exists:', fs.existsSync(publicDir))
    console.log('Story.html exists:', fs.existsSync(storyPath))
    
    // List files in public directory
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir)
      console.log('Files in public directory:', files)
    }
    
    if (!fs.existsSync(storyPath)) {
      return res.status(404).json({ 
        error: 'story.html not found',
        searchPath: storyPath,
        publicDirExists: fs.existsSync(publicDir)
      })
    }
    
    const content = fs.readFileSync(storyPath, 'utf8')
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(content)
  } catch (error) {
    console.error('Error reading story.html:', error)
    res.status(500).json({ 
      error: 'Could not load course content',
      details: error.message 
    })
  }
}