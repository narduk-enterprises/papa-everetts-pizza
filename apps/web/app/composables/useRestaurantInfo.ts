export const restaurantInfo = {
  name: "Papa Everett's Pizza Co.",
  phone: '(641) 357-4040',
  phoneHref: 'tel:+16413574040',
  addressLine: '910 US-18 E, Clear Lake, IA 50428',
  address: {
    streetAddress: '910 US-18 E',
    addressLocality: 'Clear Lake',
    addressRegion: 'IA',
    postalCode: '50428',
  },
  hours: [
    'Sunday, Tuesday-Thursday: 11:00 AM - 9:00 PM',
    'Monday: 4:00 PM - 8:00 PM',
    'Friday-Saturday: 11:00 AM - 10:00 PM',
    'Delivery begins after 4:30 PM',
  ],
}

/** Clear Lake, IA combined sales tax rate (6% state + 1% Cerro Gordo County LOST) */
export const LOCAL_TAX_RATE = 0.07

export const siteImages = {
  heroMain: '/images/authentic/pizza-hero.jpg',
  heroAbout: '/images/authentic/family-photo.jpg',
  heroCatering: '/images/authentic/hero-catering.jpg',
  heroFundraiser: '/images/authentic/hero-fundraiser.jpg',
  heroSchools: '/images/authentic/hero-schools.jpg',
  heroDining: '/images/authentic/family-photo.jpg',
  buildYourOwnHero: '/images/authentic/build-your-own-hero.png',
  categoryBuildYourOwn: '/images/authentic/build-your-own.jpg',
  categoryGourmet: '/images/authentic/menu-scan-1.jpg',
  categoryOvenBakedPastas: '/images/authentic/menu-scan-2.jpg',
  categoryAppetizers: '/images/authentic/menu-scan-2.jpg',
  categorySalads: '/images/authentic/menu-scan-2.jpg',
  categoryDesserts: '/images/authentic/menu-scan-2.jpg',
  menuScan1: '/images/authentic/menu-scan-1.jpg',
  menuScan2: '/images/authentic/menu-scan-2.jpg',
  about: '/images/authentic/founder-legacy.jpg',
  catering: '/images/authentic/hero-catering.jpg',
  contact: '/images/authentic/logo-main.jpg',
  clearLakeLions: '/images/authentic/clear-lake-lions.png',
  logoMain: '/images/authentic/logo-main.jpg',
  logoIcon: '/images/authentic/logo-icon.png',
}

export const menuSizeOrder = ['le_petit', 'small', 'medium', 'large', 'xl', 'single'] as const

export const menuSizeLabels: Record<string, string> = {
  le_petit: 'Le Petit',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
  single: 'Price',
}

export const callForCurrentPriceLabel = 'Call for Current Price'

/** Shared price formatter — returns '$X.XX' or the call-for-price label. */
export function formatPrice(value: number | null | undefined): string {
  return value == null ? callForCurrentPriceLabel : `$${value.toFixed(2)}`
}

export const toppings = [
  'Beef',
  'Pepperoni',
  'Mild Sausage',
  'Hot Sausage',
  'Canadian Bacon',
  'Onions',
  'Green Peppers',
  'Mushrooms',
  'Black Olives',
  'Green Olives',
  'Taco Chips',
  'Jalapenos',
  'Pineapple',
  'Sauerkraut',
  'Pickles',
]
