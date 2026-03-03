export interface Review {
  id: string
  author: string
  date: string
  text: string
  source: 'Google' | 'Yelp'
  rating: number
  url: string
}

/** @deprecated Use `Review` directly */
export type ReviewItem = Review

export interface ReviewsResponse {
  data: Review[]
}

export function useReviews() {
  const { data, status, refresh } = useAsyncData<ReviewsResponse>('customer-reviews', () => $fetch('/api/reviews'))

  const reviews = computed(() => data.value?.data || [])

  const items = computed<ReviewItem[]>(() => {
    return reviews.value.map(review => ({
      id: review.id,
      author: review.author,
      date: review.date,
      text: review.text,
      source: review.source,
      rating: review.rating,
      url: review.url,
    }))
  })

  return {
    reviews,
    items,
    status,
    refresh
  }
}
