import type { Ref } from 'vue'
import { ref } from 'vue'

export interface AdminUserPayload {
  email: string
  password: string
  name?: string
  isAdmin?: boolean
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
  createdAt?: string
}

const CSRF_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' } as const

export function useAdminUsers() {
  const users: Ref<AdminUser[]> = ref([])
  const pending = ref(true)

  async function fetchUsers() {
    pending.value = true
    try {
      const { data, error } = await useFetch<{ users?: AdminUser[] }>('/api/admin/users')
      if (error.value) throw new Error(error.value.message || 'Failed to fetch users')
      users.value = data.value?.users ?? []
    } catch (err) {
      console.error('Fetch Users Error:', err)
      throw err
    } finally {
      pending.value = false
    }
  }

  async function addUser(payload: AdminUserPayload) {
    try {
      const response = await $fetch<AdminUser>('/api/admin/users', {
        method: 'POST',
        body: payload,
        headers: CSRF_HEADERS,
      })
      await fetchUsers()
      return response
    } catch (err: unknown) {
      console.error('Failed to create user:', err)
      throw err
    }
  }

  async function resetUserPassword(userId: string, payload: { password: string }) {
    try {
      const response = await $fetch<{ message: string }>(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        body: payload,
        headers: CSRF_HEADERS,
      })
      return response
    } catch (err: unknown) {
      console.error('Failed to reset user password:', err)
      throw err
    }
  }

  return { users, pending, fetchUsers, addUser, resetUserPassword }
}
