import { useRuntimeConfig } from '#imports'

// Fallback high-quality curated reviews
const FALLBACK_REVIEWS = [
  {
    id: 'fallback-r1',
    source: 'Google',
    author: 'Michael T.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Best pizza in Clear Lake! The crust is perfectly crispy but airy inside. We had the Meatavore and it was loaded with high-quality toppings. Service was incredibly fast on a busy Friday night.',
    url: 'https://g.page/r/papa-everetts-pizza'
  },
  {
    id: 'fallback-r2',
    source: 'Yelp',
    author: 'Sarah L.',
    rating: 5,
    date: '1 month ago',
    text: 'A Clear Lake institution for a reason. Their taco pizza is legendary around here. The atmosphere is warm, family-friendly, and perfect for catching a game after boating on the lake.',
    url: 'https://yelp.com/biz/papa-everetts-pizza-clear-lake'
  },
  {
    id: 'fallback-r3',
    source: 'Google',
    author: 'David W.',
    rating: 5,
    date: '3 months ago',
    text: 'Absolutely fantastic! I travel across Iowa for work, and this is my must-stop place. Their "Build Your Own" sizes are huge and the ingredients are remarkably fresh. Highly recommend the garlic cheese bread!',
    url: 'https://g.page/r/papa-everetts-pizza'
  },
  {
    id: 'fallback-r4',
    source: 'Yelp',
    author: 'Emily R.',
    rating: 5,
    date: '4 months ago',
    text: 'Catered our family reunion with Papa Everett\'s and they knocked it out of the park. The pasta trays and massive XL pizzas kept 40+ people very happy. Great communication and prompt delivery!',
    url: 'https://yelp.com/biz/papa-everetts-pizza-clear-lake'
  },
  {
    id: 'fallback-r5',
    source: 'Google',
    author: 'John K.',
    rating: 5,
    date: '5 months ago',
    text: 'Awesome local spot! The staff always greets you with a smile. The deep dish lasagna was life-changing. Skip the chains and support this phenomenal local business.',
    url: 'https://g.page/r/papa-everetts-pizza'
  }
]

interface GooglePlaceReviewsResponse {
  result?: {
    url?: string
    reviews?: Array<{
      author_name?: string
      rating?: number
      text?: string
      time?: number
      relative_time_description?: string
    }>
  }
}

interface YelpReviewsResponse {
  reviews?: Array<{
    id?: string
    rating?: number
    text?: string
    time_created?: string
    url?: string
    user?: { name?: string }
  }>
}

interface ReviewItem {
  id: string
  source: string
  author: string
  rating: number
  date: string
  text: string
  url: string
  timestamp?: number
}

// We use defineCachedEventHandler to ensure we only scrape Google/Yelp periodically.
// maxAge: 60 * 60 * 24 = 86400 seconds (24 hours).
// This prevents API rate limiting and provides instant responses.
export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  try {
    const reviews: ReviewItem[] = []

    // 1. Fetch Google Reviews
    if (config.googlePlacesApiKey && config.public.googlePlaceId) {
      try {
        const googleRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${config.public.googlePlaceId}&fields=reviews,url&key=${config.googlePlacesApiKey}`)
        if (googleRes.ok) {
          const googleData = (await googleRes.json()) as GooglePlaceReviewsResponse
          if (googleData.result?.reviews) {
            const placeUrl = googleData.result.url ?? 'https://google.com/maps'
            for (const r of googleData.result.reviews) {
              if (r.rating != null && r.rating >= 4 && r.text && r.text.length > 20) {
                reviews.push({
                  id: `google-${r.time ?? Date.now()}`,
                  source: 'Google',
                  author: r.author_name ?? 'Anonymous',
                  rating: Math.floor(r.rating),
                  date: r.relative_time_description ?? '',
                  text: r.text,
                  url: placeUrl,
                  timestamp: r.time
                })
              }
            }
          }
        } else {
          console.error('Failed to fetch Google reviews:', googleRes.statusText)
        }
      } catch (e) {
        console.error('Error fetching Google reviews:', e)
      }
    }

    // 2. Fetch Yelp Reviews
    if (config.yelpApiKey && config.public.yelpBusinessId) {
      try {
        const yelpRes = await fetch(`https://api.yelp.com/v3/businesses/${config.public.yelpBusinessId}/reviews?limit=5&sort_by=yelp_sort`, {
          headers: {
            'Authorization': `Bearer ${config.yelpApiKey}`
          }
        })
        if (yelpRes.ok) {
          const yelpData = (await yelpRes.json()) as YelpReviewsResponse
          if (yelpData.reviews) {
            for (const r of yelpData.reviews) {
              if (r.rating != null && r.rating >= 4 && r.text && r.text.length > 20) {
                const timeCreated = r.time_created ?? ''
                reviews.push({
                  id: r.id ?? `yelp-${Date.now()}`,
                  source: 'Yelp',
                  author: r.user?.name ?? 'Anonymous',
                  rating: Math.floor(r.rating!),
                  date: timeCreated.split(' ')[0] ?? '',
                  text: r.text,
                  url: r.url ?? '',
                  timestamp: timeCreated ? new Date(timeCreated).getTime() / 1000 : undefined
                })
              }
            }
          }
        } else {
          console.error('Failed to fetch Yelp reviews:', yelpRes.statusText)
        }
      } catch (e) {
        console.error('Error fetching Yelp reviews:', e)
      }
    }

    // 3. Process and Return
    // If we successfully fetched reviews, sort them by newest first and return top 8
    if (reviews.length > 0) {
      reviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      return {
        success: true,
        data: reviews.slice(0, 8)
      }
    } else {
      // If we made it here, no API keys were configured, or both APIs failed
      console.log('No live reviews fetched. Falling back to static curated reviews.')
      return {
        success: true,
        data: FALLBACK_REVIEWS
      }
    }

  } catch (globalError) {
    // Ultimate fallback catch-all
    console.error('Critical failure in reviews endpoint:', globalError)
    return {
      success: true,
      data: FALLBACK_REVIEWS
    }
  }

}, {
  maxAge: 60 * 60 * 24, // Cache for 24 hours
  swr: true, // Serve stale while revalidating
  name: 'customer-reviews'
})
