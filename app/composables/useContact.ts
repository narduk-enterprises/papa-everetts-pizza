export function useContact() {

  async function submitContact(values: any, topic: 'general' | 'catering' | 'review' | 'contact') {
    return await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...values,
        topic,
      },
    })
  }

  return {
    submitContact,
  }
}
