<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useAdminUsers, type AdminUser } from '~/composables/useAdminUsers';

useSeo({
  robots: 'noindex',
  title: 'User Management | Admin',
  description: 'Admin user management.',
  robots: 'noindex, nofollow',
});
useWebPageSchema({ name: 'User Management | Admin', description: 'Admin user management.' });

const toast = useToast();
const { users, pending, fetchUsers, addUser, resetUserPassword } = useAdminUsers();
const { user, loggedIn, refresh } = useAuth();

// Fix hydration mismatch: wait for auth so Server matches Client conditional render
await refresh();

onMounted(async () => {
  if (loggedIn.value && user.value?.isAdmin) {
    await fetchUsers();
  }
});

// Add User Form State
const isAddingUser = ref(false);
const nuState = reactive({
  email: '',
  password: '',
  name: '',
  isAdmin: false,
});

const authSchema = computed(() =>
  z.object({
    email: z.string({ message: 'Email is required' }).email('Valid email required'),
    password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
    isAdmin: z.boolean(),
  })
);

async function onSubmitUser(_event: FormSubmitEvent<{ email: string; password: string; name?: string; isAdmin: boolean }>) {
  isAddingUser.value = true;
  try {
    await addUser({
      email: nuState.email,
      password: nuState.password,
      name: nuState.name ?? '',
      isAdmin: nuState.isAdmin,
    });

    toast.add({ title: 'User Created', color: 'success', icon: 'i-lucide-check' });
    nuState.email = '';
    nuState.password = '';
    nuState.name = '';
    nuState.isAdmin = false;
  } catch (error: unknown) {
    const msg = (error as { data?: { message?: string } })?.data?.message ?? 'Could not create user.';
    toast.add({
      title: 'User Creation Failed',
      description: msg,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    isAddingUser.value = false;
  }
}

// Password Reset Form State
const isResetModalOpen = ref(false);
const resetTargetUser = ref<AdminUser | null>(null);
const isResettingPassword = ref(false);
const resetState = reactive({
  password: '',
});

const resetSchema = computed(() =>
  z.object({
    password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  })
);

const resetModalDescription = computed(() => {
  if (!resetTargetUser.value) return '';
  return `Resetting password for ${resetTargetUser.value.email}`;
});

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

function openResetModal(u: AdminUser) {
  resetTargetUser.value = u;
  resetState.password = '';
  isResetModalOpen.value = true;
}

async function onSubmitReset(_event: FormSubmitEvent<{ password: string }>) {
  if (!resetTargetUser.value) return;
  isResettingPassword.value = true;
  try {
    await resetUserPassword(resetTargetUser.value.id, {
      password: resetState.password,
    });
    toast.add({ title: 'Password Reset', description: `Password for ${resetTargetUser.value.email} has been updated.`, color: 'success', icon: 'i-lucide-check' });
    isResetModalOpen.value = false;
  } catch (error: unknown) {
    const msg = (error as { data?: { message?: string } })?.data?.message ?? 'Could not reset password.';
    toast.add({
      title: 'Password Reset Failed',
      description: msg,
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    isResettingPassword.value = false;
  }
}
</script>

<template>
  <section
    class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    style="
      font-family:
        system-ui,
        -apple-system,
        sans-serif;
    "
  >
    <div class="mb-8 flex items-center gap-4">
      <UButton to="/admin" variant="ghost" color="neutral" icon="i-lucide-arrow-left"
        >Back to Admin</UButton
      >
    </div>

    <!-- Non-admin notice -->
    <div
      v-if="!loggedIn || !user?.isAdmin"
      class="mt-8 rounded-xl border border-pizza-border p-6 bg-elevated"
    >
      <p class="text-lg font-medium text-pizza-text">Access Denied.</p>
      <p class="text-pizza-muted mt-2">Use an admin account to access user management.</p>
    </div>

    <!-- Admin content -->
    <div v-else>
      <div class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight">User Management</h1>
        <p class="warm-muted mt-1">Create and manage admin users across the platform.</p>
      </div>

      <div class="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
        <!-- User List -->
        <div
          class="rounded-xl border border-pizza-border bg-pizza-surface shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-pizza-border bg-elevated">
            <h2 class="font-bold text-lg">Existing Users</h2>
          </div>

          <div v-if="pending && !users.length" class="p-8 text-center text-pizza-muted">
            Loading...
          </div>
          <div v-else-if="!users.length" class="p-8 text-center text-pizza-muted">
            No users found.
          </div>

          <ul v-else class="divide-y divide-pizza-border">
            <li v-for="u in users" :key="u.id" class="p-4 flex items-center justify-between">
              <div>
                <p class="font-bold text-pizza-text">
                  {{ u.name || 'No Name' }}
                  <span
                    v-if="u.isAdmin"
                    class="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest"
                    >Admin</span
                  >
                </p>
                <p class="text-sm text-pizza-muted mt-0.5">{{ u.email }}</p>
              </div>
              <div class="text-right flex flex-col items-end gap-2">
                <span class="text-xs text-pizza-muted block"
                  >Since {{ formatDate(u.createdAt ?? '') }}</span
                >
                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-key" @click="openResetModal(u)">
                  Reset Password
                </UButton>
              </div>
            </li>
          </ul>
        </div>

        <!-- Add User Form -->
        <div
          class="rounded-xl border border-pizza-border bg-pizza-surface shadow-sm p-6 sticky top-24"
        >
          <h2 class="font-bold text-lg mb-4">Add User</h2>
          <UForm :state="nuState" :schema="authSchema" @submit="onSubmitUser" class="space-y-4">
            <UFormField label="Email" name="email">
              <UInput
                v-model="nuState.email"
                type="email"
                placeholder="newuser@example.com"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Password" name="password">
              <UInput
                v-model="nuState.password"
                type="password"
                placeholder="••••••••"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Name (Optional)" name="name">
              <UInput v-model="nuState.name" placeholder="John Doe" class="w-full" />
            </UFormField>

            <UFormField class="pt-2">
              <div class="flex items-center gap-2">
                <USwitch v-model="nuState.isAdmin" />
                <span class="text-sm font-medium">Create as Admin</span>
              </div>
            </UFormField>

            <div class="pt-4 border-t border-pizza-border">
              <UButton
                type="submit"
                color="primary"
                class="w-full justify-center"
                :loading="isAddingUser"
                icon="i-lucide-user-plus"
              >
                Create User
              </UButton>
            </div>
          </UForm>
        </div>
      </div>

      <!-- Password Reset Modal -->
      <UModal v-model:open="isResetModalOpen" title="Reset Password" :description="resetModalDescription">
        <template #body>
          <UForm :state="resetState" :schema="resetSchema" @submit="onSubmitReset" class="space-y-4">
            <UFormField label="New Password" name="password">
              <UInput
                v-model="resetState.password"
                type="password"
                placeholder="••••••••"
                class="w-full"
              />
            </UFormField>

            <div class="pt-4 flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="isResetModalOpen = false">Cancel</UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="isResettingPassword"
              >
                Update Password
              </UButton>
            </div>
          </UForm>
        </template>
      </UModal>
    </div>
  </section>
</template>
