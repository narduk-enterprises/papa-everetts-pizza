/**
 * Global auth composable.
 *
 * Provides reactive `user`, `loggedIn`, and helper methods (`login`, `signup`,
 * `logout`, `refresh`). State is shared across the app via `useAsyncData`.
 *
 * Usage:
 *   const { user, loggedIn, login, logout } = useAuth()
 */

interface AuthUser {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

export function useAuth() {
  const requestFetch = import.meta.server ? useRequestFetch() : $fetch

  const { data: user, refresh, status } = useAsyncData<AuthUser | null>(
    'auth-user',
    async () => {
      try {
        const res = await requestFetch<{ user: AuthUser | null }>('/api/auth/me')
        return res.user ?? null
      } catch {
        return null
      }
    },
    {
      // Don't block navigation — auth state is resolved in background
      lazy: true,
      // Cache across navigations within the same session
      dedupe: 'defer',
    },
  )

  const loggedIn = computed(() => !!user.value)
  const loading = computed(() => status.value === 'pending')

  async function login(email: string, password: string) {
    const res = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    user.value = res.user
    return res.user
  }

  async function signup(email: string, password: string, name?: string) {
    const res = await $fetch<{ user: AuthUser }>('/api/auth/signup', {
      method: 'POST',
      body: { email, password, name },
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    user.value = res.user
    return res.user
  }

  async function logout() {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
    user.value = null
  }

  return {
    user: readonly(user) as Readonly<Ref<AuthUser | null>>,
    loggedIn,
    loading,
    login,
    signup,
    logout,
    refresh,
  }
}
