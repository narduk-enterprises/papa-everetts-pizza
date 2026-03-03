export interface ContactFormValues {
  name: string
  email: string
  phone?: string
  message: string
}

export function useContact() {
  async function submitContact(values: ContactFormValues, topic: 'general' | 'catering' | 'review' | 'contact') {
    return await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...values,
        topic,
      },
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
  }

  return {
    submitContact,
  }
}
