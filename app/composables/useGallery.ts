// composables/useGallery.ts
// Reusable gallery data & filter logic

export type ArtCategory = 'all' | 'painting' | 'sculpture' | 'print'
export type ArtStatus = 'available' | 'sold'

export interface Artwork {
  id: string
  title: string
  titleKm: string
  year: number
  medium: string
  mediumKm: string
  size: string
  price: number | null
  status: ArtStatus
  category: ArtCategory
  image: string
  featured: boolean
  description: string
  descriptionKm: string
}

// Reusable artwork dataset (in real app: fetch from API)
const artworks: Artwork[] = [
  {
    id: 'a1',
    title: 'Apsara Rising',
    titleKm: 'អប្សរា​ ​ ​ ​',
    year: 2024,
    medium: 'Oil on canvas',
    mediumKm: 'ប្រេង​លើ​ក្អែប',
    size: '120 × 90 cm',
    price: 4800,
    status: 'available',
    category: 'painting',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    featured: true,
    description: 'A luminous reimagining of the celestial dancers of Angkor, rendered in warm ochres and deep vermillion.',
    descriptionKm: 'ការ​ស្រម​ំ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​',
  },
  {
    id: 'a2',
    title: 'Tonlé Sap Memory',
    titleKm: '​ ​ ​​ ​ ​ ​ ​ ​ ​',
    year: 2023,
    medium: 'Acrylic & gold leaf',
    mediumKm: '​ ​ ​ ​ ​ ​ ​ ​',
    size: '80 × 100 cm',
    price: 3200,
    status: 'available',
    category: 'painting',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
    featured: true,
    description: 'The lake in its flood season — vast, silver, carrying the reflections of a floating village.',
    descriptionKm: '​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​',
  },
  {
    id: 'a3',
    title: 'Khmer Twilight',
    titleKm: '​ ​ ​​ ​​ ​',
    year: 2024,
    medium: 'Mixed media on board',
    mediumKm: '​ ​ ​ ​ ​',
    size: '60 × 60 cm',
    price: 2400,
    status: 'sold',
    category: 'painting',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80',
    featured: true,
    description: 'Silhouettes against a burning dusk — temple spires dissolving into abstraction.',
    descriptionKm: '​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​',
  },
  {
    id: 'a4',
    title: 'Lotus Vessel I',
    titleKm: '​ ​ ​​ ​ ​ ​',
    year: 2023,
    medium: 'Stoneware ceramic',
    mediumKm: '​ ​ ​ ​ ​',
    size: '38 × 22 cm',
    price: 1800,
    status: 'available',
    category: 'sculpture',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    featured: false,
    description: 'Hand-thrown stoneware with lotus relief carvings, gold-fired glaze.',
    descriptionKm: '​ ​ ​ ​ ​ ​ ​ ​ ​',
  },
  {
    id: 'a5',
    title: 'Temple Study No. 7',
    titleKm: '​ ​ ​ ​ ​ ​ ​',
    year: 2022,
    medium: 'Archival pigment print',
    mediumKm: '​ ​ ​ ​ ​',
    size: '50 × 70 cm',
    price: 680,
    status: 'available',
    category: 'print',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
    featured: false,
    description: 'Limited edition of 30. Signed and numbered. Archival paper.',
    descriptionKm: '​ ​ ​ ​ ​ ​ ​ ​',
  },
  {
    id: 'a6',
    title: 'Earth & Sky Form',
    titleKm: '​ ​ ​​ ​ ​ ​ ​ ​',
    year: 2024,
    medium: 'Bronze',
    mediumKm: '​ ​',
    size: '45 × 30 × 20 cm',
    price: 6400,
    status: 'available',
    category: 'sculpture',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    featured: true,
    description: 'Cast bronze, patinated. An abstraction of the Phnom — Cambodia\'s sacred hill mythology.',
    descriptionKm: '​ ​ ​ ​ ​ ​ ​ ​ ​ ​ ​',
  },
]

export const useGallery = () => {
  const activeCategory = ref<ArtCategory>('all')

  const filteredArtworks = computed(() => {
    if (activeCategory.value === 'all') return artworks
    return artworks.filter(a => a.category === activeCategory.value)
  })

  const featuredArtworks = computed(() => artworks.filter(a => a.featured))

  const setCategory = (cat: ArtCategory) => {
    activeCategory.value = cat
  }

  const getArtworkById = (id: string) => artworks.find(a => a.id === id)

  const formatPrice = (price: number | null, currency = 'USD') => {
    if (!price) return 'Price on request'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
  }

  return {
    artworks,
    filteredArtworks,
    featuredArtworks,
    activeCategory,
    setCategory,
    getArtworkById,
    formatPrice,
  }
}
