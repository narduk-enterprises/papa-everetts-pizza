import { fileURLToPath } from 'url'

const PLACE_ID = process.env.GOOGLE_PLACE_ID
const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_API_KEY

async function debugPhotos() {
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=photos&key=${API_KEY}`)
  const data = await res.json()
  console.log(JSON.stringify(data, null, 2))
}

debugPhotos()
