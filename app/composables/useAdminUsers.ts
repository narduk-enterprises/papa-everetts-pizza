import { ref } from 'vue'

export function useAdminUsers() {
  const users = ref<any[]>([])
  const pending = ref(true)

  async function fetchUsers() {
    pending.value = true
    try {
      const { data, error } = await useFetch('/api/admin/users')
      if (error.value) throw new Error(error.value.message || 'Failed to fetch users')
      users.value = data.value as any[]
    } catch (err) {
      console.error('Fetch Users Error:', err)
      throw err
    } finally {
      pending.value = false
    }
  }

  async function addUser(payload: any) {
    try {
      const response = await $fetch('/api/admin/users', {
        method: 'POST',
        body: payload
      })
      await fetchUsers()
      return response
    } catch (err: any) {
      console.error('Failed to create user:', err)
      throw err
    }
  }

  async function resetUserPassword(userId: string, payload: any) {
    try {
      const response = await $fetch(`/api/admin/users/${userId}/password`, {
        method: 'PUT',
        body: payload
      })
      return response
    } catch (err: any) {
      console.error('Failed to reset user password:', err)
      throw err
    }
  }

  return { users, pending, fetchUsers, addUser, resetUserPassword }
}
