import { readFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const { IMAGES } = event.context.cloudflare?.env || {}

  if (!IMAGES) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Storage not configured',
    })
  }

  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File | null

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    // Validate type
    const mimeType = file.type
    if (!mimeType.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only image files are allowed',
      })
    }

    // Generate path
    const ext = file.name.split('.').pop() || 'tmp'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`
    
    // Store in R2 bucket
    const arrayBuffer = await file.arrayBuffer()
    await IMAGES.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: mimeType,
      }
    })

    return {
      success: true,
      url: `/images/${fileName}`
    }
  } catch (error) {
    console.error('R2 Upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image'
    })
  }
})
