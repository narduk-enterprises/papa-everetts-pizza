/**
 * Curated Facebook photo data for use across the site.
 * De-duplicated — only one representative from each visual group.
 * All photos live in /public/images/facebook/
 */

export interface SitePhoto {
  src: string
  alt: string
  category: 'pizza' | 'pasta' | 'sides' | 'restaurant' | 'branding' | 'team'
}

/** All unique photos from Facebook — de-duplicated, no visual repeats */
export const allPhotos: SitePhoto[] = [
  // ─── Pizza ───
  { src: '/images/facebook/photo_100.jpg', alt: 'Sausage pizza fresh from the oven', category: 'pizza' },
  { src: '/images/facebook/photo_101.jpg', alt: 'Cheeseburger pizza with pickles and cheddar', category: 'pizza' },
  { src: '/images/facebook/photo_103.jpg', alt: 'Sausage pizza on the oven rack', category: 'pizza' },
  { src: '/images/facebook/photo_020.jpg', alt: 'Supreme pizza loaded with toppings', category: 'pizza' },
  { src: '/images/facebook/photo_004.jpg', alt: 'Taco pizza with lettuce, tomato, and cheddar', category: 'pizza' },
  { src: '/images/facebook/photo_013.jpg', alt: 'Sausage pizza coming out of the oven', category: 'pizza' },
  { src: '/images/facebook/photo_027.jpg', alt: 'Cheese pizza on a colorful plate', category: 'pizza' },
  { src: '/images/facebook/photo_007.jpg', alt: 'Half pepperoni and half sausage pizza', category: 'pizza' },
  { src: '/images/facebook/photo_040.jpg', alt: 'Jalapeño and onion pizza', category: 'pizza' },
  { src: '/images/facebook/photo_048.jpg', alt: 'Taco pizza piled high with lettuce', category: 'pizza' },
  { src: '/images/facebook/photo_049.jpg', alt: 'Garlic cheese bread pizza with green pepper', category: 'pizza' },
  { src: '/images/facebook/photo_009.jpg', alt: 'Mushroom pizza being sliced fresh', category: 'pizza' },
  { src: '/images/facebook/photo_039.jpg', alt: 'Pizza fresh from the oven — action shot', category: 'pizza' },

  // ─── Pasta & Sides ───
  { src: '/images/facebook/photo_104.jpg', alt: 'Baked lasagna in a foil tray', category: 'pasta' },
  { src: '/images/facebook/photo_099.jpg', alt: 'Baked lasagna topped with melted cheese', category: 'pasta' },
  { src: '/images/facebook/photo_012.jpg', alt: 'Cheesy baked pasta in a foil pan', category: 'pasta' },
  { src: '/images/facebook/photo_052.jpg', alt: 'Fresh spaghetti noodles close-up', category: 'pasta' },
  { src: '/images/facebook/photo_102.jpg', alt: 'Golden calzone fresh from the oven', category: 'sides' },
  { src: '/images/facebook/photo_015.jpg', alt: 'Cheesy calzone on the oven rack', category: 'sides' },
  { src: '/images/facebook/photo_011.jpg', alt: 'Cheesy breadstick close-up on the rack', category: 'sides' },

  // ─── Restaurant & People ───
  { src: '/images/facebook/photo_077.jpg', alt: 'Busy dining room with Italian murals', category: 'restaurant' },
  { src: '/images/facebook/photo_069.jpg', alt: 'Restaurant interior — diners enjoying meals', category: 'restaurant' },
  { src: '/images/facebook/photo_064.jpg', alt: 'Cozy booths with Tuscan-style paintings', category: 'restaurant' },
  { src: '/images/facebook/photo_072.jpg', alt: 'Papa Everett\'s building exterior — red roof', category: 'restaurant' },
  { src: '/images/facebook/photo_075.jpg', alt: 'Kids at the counter ordering', category: 'restaurant' },
  { src: '/images/facebook/photo_062.jpg', alt: 'Kitchen crew prepping dough', category: 'restaurant' },
  { src: '/images/facebook/photo_002.jpg', alt: 'Papa Everett\'s team selfie — cheers!', category: 'team' },

  // ─── Branding ───
  { src: '/images/facebook/photo_001.png', alt: 'Papa Everett\'s Pizza storefront banner', category: 'branding' },
  { src: '/images/facebook/photo_098.jpg', alt: 'Papa Everett\'s Handcrafted Pizza logo', category: 'branding' },
]

/** Best photos for the homepage strip — visually diverse food shots */
export const homepagePhotos: SitePhoto[] = [
  allPhotos[0]!,  // sausage pizza (large)
  allPhotos[1]!,  // cheeseburger pizza
  allPhotos[4]!,  // taco pizza
  allPhotos[3]!,  // supreme pizza
  allPhotos[17]!, // calzone
  allPhotos[13]!, // lasagna
  allPhotos[6]!,  // cheese pizza on plate
  allPhotos[8]!,  // jalapeño pizza
  allPhotos[7]!,  // half-and-half pepperoni/sausage
  allPhotos[10]!, // garlic cheese bread pizza
  allPhotos[2]!,  // sausage on rack
  allPhotos[14]!, // lasagna variant
]

/** Photos for the about page — restaurant, team, kitchen */
export const aboutPhotos: SitePhoto[] = [
  allPhotos[20]!, // busy dining room
  allPhotos[26]!, // team selfie
  allPhotos[25]!, // kitchen crew
  allPhotos[22]!, // booths
  allPhotos[27]!, // storefront banner
  allPhotos[23]!, // building exterior
]

/** Photos for catering page — food variety for events */
export const cateringPhotos: SitePhoto[] = [
  allPhotos[3]!,  // supreme pizza (large)
  allPhotos[0]!,  // sausage pizza
  allPhotos[17]!, // calzone
  allPhotos[13]!, // lasagna
  allPhotos[16]!, // spaghetti
  allPhotos[4]!,  // taco pizza
  allPhotos[1]!,  // cheeseburger pizza
  allPhotos[8]!,  // jalapeño pizza
]
