import { requireAdminUser } from '../../../utils/auth-guards'
import { users } from '../../../database/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdminUser(event)
  const db = useDatabase()
  
  // Return all users, omitting password hashes
  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    isAdmin: users.isAdmin,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }).from(users).orderBy(desc(users.createdAt)).all()

  return allUsers
})
