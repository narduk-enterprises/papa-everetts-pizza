import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJZS3XemAK8YcRySxyE0BOjb4'
const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_API_KEY

async function fetchPhotos() {
  if (!PLACE_ID || !API_KEY) {
    console.error('Missing GOOGLE_PLACE_ID or GOOGLE_MAPS_PLATFORM_API_KEY environment variables.')
    process.exit(1)
  }

  const outputDir = path.join(__dirname, '..', 'public', 'images', 'food')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log(`Fetching details for place ID: ${PLACE_ID}...`)
  
  try {
    const detailsRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=photos&key=${API_KEY}`)
    
    if (!detailsRes.ok) {
      throw new Error(`Failed to fetch place details: ${detailsRes.statusText}`)
    }

    const detailsData = await detailsRes.json()
    const photos = detailsData.result?.photos

    if (!photos || photos.length === 0) {
      console.log('No photos found for this place.')
      return
    }

    console.log(`Found ${photos.length} photos. Downloading all...`)

    const topPhotos = photos

    for (let i = 0; i < topPhotos.length; i++) {
      const photo = topPhotos[i]
      const reference = photo.photo_reference
      const maxwidth = 800 // high enough for good quality, small enough for web

      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${reference}&key=${API_KEY}`
      
      console.log(`Downloading photo ${i + 1}/${topPhotos.length}...`)
      
      const imageRes = await fetch(photoUrl)
      
      if (!imageRes.ok) {
        console.error(`Failed to download photo ${i + 1}: ${imageRes.statusText}`)
        continue
      }

      const buffer = await imageRes.arrayBuffer()
      const outputPath = path.join(outputDir, `authentic-${i + 1}.jpg`)
      
      fs.writeFileSync(outputPath, Buffer.from(buffer))
      console.log(`Saved to ${outputPath}`)
      
      // small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    console.log('Photo downloading complete!')

  } catch (error) {
    console.error('Error fetching photos:', error)
  }
}

fetchPhotos()
