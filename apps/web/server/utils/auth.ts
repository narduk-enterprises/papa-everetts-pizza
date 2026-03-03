import type { H3Event } from 'h3'
import { eq, count } from 'drizzle-orm'
import { users, sessions } from '../database/schema'
import type { User } from '../database/schema'

// ─── Crypto helpers (Web Crypto API — Workers-compatible) ───

const PBKDF2_ITERATIONS = 100_000
const SALT_LENGTH = 16
const KEY_LENGTH = 32

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
  const key = await deriveKey(password, salt)
  const hash = new Uint8Array(await crypto.subtle.exportKey('raw', key))

  // Store as salt:hash (both hex-encoded)
  return `${toHex(salt)}:${toHex(hash)}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false

  const salt = fromHex(saltHex)
  const key = await deriveKey(password, salt)
  const hash = new Uint8Array(await crypto.subtle.exportKey('raw', key))

  return toHex(hash) === hashHex
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH * 8 },
    true,
    ['encrypt'],
  )
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

function generateId(): string {
  return crypto.randomUUID()
}

const fallbackUsers = new Map<string, User>()
const fallbackSessions = new Map<string, typeof sessions.$inferSelect>()

// ─── User management ────────────────────────────────────────

export async function createUser(event: H3Event, email: string, password: string, name?: string, isAdmin = false): Promise<User> {
  const id = generateId()
  const passwordHash = await hashPassword(password)
  const now = new Date().toISOString()

  try {
    const db = useDatabase(event)

    await db.insert(users).values({
      id,
      email: email.toLowerCase(),
      passwordHash,
      name: name || null,
      isAdmin,
      createdAt: now,
      updatedAt: now,
    })

    const user = await db.select().from(users).where(eq(users.id, id)).get()
    if (!user) throw new Error('Failed to create user')
    return user
  } catch (err) {
    console.error('[auth] createUser DB failed, using in-memory fallback:', err)
    const user: User = {
      id,
      email: email.toLowerCase(),
      passwordHash,
      name: name || null,
      appleId: null,
      isAdmin,
      createdAt: now,
      updatedAt: now,
    }
    fallbackUsers.set(id, user)
    return user
  }
}

export async function getUserByEmail(event: H3Event, email: string): Promise<User | undefined> {
  try {
    const db = useDatabase(event)
    return db.select().from(users).where(eq(users.email, email.toLowerCase())).get()
  } catch (err) {
    console.error('[auth] getUserByEmail DB failed, using in-memory fallback:', err)
    return Array.from(fallbackUsers.values()).find(user => user.email === email.toLowerCase())
  }
}

export async function getUserCount(event: H3Event): Promise<number> {
  try {
    const db = useDatabase(event)
    const row = await db.select({ totalUsers: count() }).from(users).get()
    return row?.totalUsers || 0
  } catch (err) {
    console.error('[auth] getUserCount DB failed, using in-memory fallback:', err)
    return fallbackUsers.size
  }
}

export async function verifyCredentials(event: H3Event, email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(event, email)
  if (!user || !user.passwordHash) return null

  const valid = await verifyPassword(password, user.passwordHash)
  return valid ? user : null
}

export async function updateUserPassword(event: H3Event, userId: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  const now = new Date().toISOString()

  try {
    const db = useDatabase(event)

    await db.update(users)
      .set({ passwordHash, updatedAt: now })
      .where(eq(users.id, userId))

    const user = await db.select().from(users).where(eq(users.id, userId)).get()
    if (!user) throw new Error('Failed to update user password')
    return user
  } catch (err) {
    console.error('[auth] updateUserPassword DB failed, using in-memory fallback:', err)
    const user = fallbackUsers.get(userId)
    if (!user) throw new Error('User not found in fallback')
    
    user.passwordHash = passwordHash
    user.updatedAt = now
    return user
  }
}

// ─── Session management ─────────────────────────────────────

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export async function createSession(event: H3Event, userId: string): Promise<string> {
  const id = generateId()
  const expiresAt = Date.now() + SESSION_DURATION_MS

  try {
    const db = useDatabase(event)
    await db.insert(sessions).values({
      id,
      userId,
      expiresAt,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[auth] createSession DB failed, using in-memory fallback:', err)
    fallbackSessions.set(id, {
      id,
      userId,
      expiresAt,
      createdAt: new Date().toISOString(),
    })
  }

  return id
}

export async function getAuthSession(event: H3Event, sessionId: string): Promise<{ session: typeof sessions.$inferSelect; user: User } | null> {
  try {
    const db = useDatabase(event)
    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get()

    if (!session) return null
    if (session.expiresAt < Date.now()) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
      return null
    }

    const user = await db.select().from(users).where(eq(users.id, session.userId)).get()
    if (!user) return null

    return { session, user }
  } catch (err) {
    console.error('[auth] getAuthSession DB failed, using in-memory fallback:', err)
    const session = fallbackSessions.get(sessionId)
    if (!session) return null
    if (session.expiresAt < Date.now()) {
      fallbackSessions.delete(sessionId)
      return null
    }

    const user = fallbackUsers.get(session.userId)
    if (!user) return null

    return { session, user }
  }
}

export async function deleteSession(event: H3Event, sessionId: string): Promise<void> {
  try {
    const db = useDatabase(event)
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  } catch (err) {
    console.error('[auth] deleteSession DB failed, using in-memory fallback:', err)
    fallbackSessions.delete(sessionId)
  }
}
