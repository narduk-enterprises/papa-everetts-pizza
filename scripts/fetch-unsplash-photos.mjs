import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const images = [
  { name: 'appetizer-wings.jpg', url: 'https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?q=80&w=800&auto=format&fit=crop' },
  { name: 'pizza-build-your-own.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
  { name: 'dessert-apple.jpg', url: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=800&auto=format&fit=crop' },
  { name: 'pizza-meatavore.jpg', url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop' },
  { name: 'pizza-taco.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' }, // substituting generic pizza since "taco pizza" is specific
  { name: 'pizza-combo.jpg', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop' },
  { name: 'pasta-lasagna.jpg', url: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=800&auto=format&fit=crop' },
  { name: 'salad-chef.jpg', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' }
]

const outputDir = path.join(__dirname, '..', 'public', 'images', 'food')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return resolve(download(response.headers.location, filePath))
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }

      const file = fs.createWriteStream(filePath)
      response.pipe(file)
      file.on('finish', () => {
        file.close(resolve)
      })
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err))
    })
  })
}

async function fetchAll() {
  console.log('Fetching authentic images locally...')
  for (const img of images) {
    const dest = path.join(outputDir, img.name)
    console.log(`Downloading ${img.name}...`)
    try {
      await download(img.url, dest)
      console.log(`Saved ${img.name}`)
    } catch (e) {
      console.error(`Failed to save ${img.name}:`, e.message)
    }
  }
  console.log('Complete.')
}

fetchAll()
