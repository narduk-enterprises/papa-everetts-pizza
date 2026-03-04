import { z } from 'zod'
import { contactSubmissions } from '../database/schema'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().default(''),
  message: z.string().min(10, 'Please provide at least 10 characters'),
  topic: z.enum(['contact', 'catering', 'fundraisers', 'schools']).default('contact'),
})

export default defineEventHandler(async (event) => {
  await enforceRateLimit(event, 'contact-form', 5, 60_000)

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }

  const { name, email, phone, message, topic } = parsed.data

  // Store in D1 database
  try {
    const db = useAppDatabase(event)
    await db.insert(contactSubmissions).values({
      name,
      email,
      phone: phone || null,
      message,
      topic,
    })
  } catch (err) {
    console.error('[contact] Failed to store submission in D1:', err)
    // Don't fail the request — still confirm receipt to the user
  }

  return {
    success: true,
    receivedAt: new Date().toISOString(),
    topic,
  }
})
