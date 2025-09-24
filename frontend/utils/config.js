// Configuration for API URLs and backend connections

// Backend URL for API calls
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://8000-ipmc1ldd2u247m6s0ffgq-6532622b.e2b.dev'

// Backend URL for serving static files (images, uploads)
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://8000-ipmc1ldd2u247m6s0ffgq-6532622b.e2b.dev'

// Image endpoints
export const IMAGE_BASE_URL = `${BACKEND_URL}/uploads`

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // If imagePath already contains full URL (starts with http), return as is
  if (imagePath.startsWith('http')) return imagePath
  
  // If imagePath starts with /uploads/, construct full URL
  if (imagePath.startsWith('/uploads/')) {
    return `${BACKEND_URL}${imagePath}`
  }
  
  // If imagePath is just filename, add uploads prefix
  return `${BACKEND_URL}/uploads/${imagePath}`
}

export default {
  API_BASE_URL,
  BACKEND_URL,
  IMAGE_BASE_URL,
  getImageUrl
}