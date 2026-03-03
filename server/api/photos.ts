const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', // classic pizza
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // flatbread
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop', // slice being pulled
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop', // rustic oven pizza
  'https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=800&auto=format&fit=crop', // serving pizza
  'https://images.unsplash.com/photo-1590947132387-155cc3c38cb6?q=80&w=800&auto=format&fit=crop'  // mozzarella and meat
]

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const photos: string[] = []

  try {
    if (config.googlePlacesApiKey && config.public.googlePlaceId) {
      // Fetch the Place Details specifically requesting the photos array
      const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${config.public.googlePlaceId}&fields=photos&key=${config.googlePlacesApiKey}`)

      if (res.ok) {
        const data = await res.json()
        if (data.result && data.result.photos) {
          // Google Places returns photo "references". 
          // We must construct the actual image URL using the reference and key.
          // Limiting to the first 8 high-quality photos provided by the business/users.
          const topPhotos = data.result.photos.slice(0, 8)

          for (const photoObj of topPhotos) {
            if (photoObj.photo_reference) {
              // We request maxwidth 800 to ensure fast loading but good resolution
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoObj.photo_reference}&key=${config.googlePlacesApiKey}`
              photos.push(photoUrl)
            }
          }
        }
      } else {
        console.error('Failed to fetch Google Place photos:', res.statusText)
      }
    }

    if (photos.length > 0) {
      return {
        success: true,
        data: photos
      }
    } else {
      console.log('No live photos configured or fetched. Flowing back to static curations.')
      return {
        success: true,
        data: FALLBACK_PHOTOS
      }
    }

  } catch (error) {
    console.error('Critical failure in photos endpoint:', error)
    return {
      success: true,
      data: FALLBACK_PHOTOS
    }
  }

}, {
  maxAge: 60 * 60 * 24, // 24 Hours
  swr: true,
  name: 'location-photos'
})
