// composables/useContact.ts
// Reusable contact form logic with validation

export interface ContactForm {
  name: string
  email: string
  message: string
}

export const useContact = () => {
  const form = reactive<ContactForm>({ name: '', email: '', message: '' })
  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const errors = reactive<Partial<ContactForm>>({})

  const validate = (): boolean => {
    errors.name = !form.name.trim() ? 'Name is required' : undefined
    errors.email = !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Valid email required' : undefined
    errors.message = !form.message.trim() ? 'Message is required' : undefined
    return !errors.name && !errors.email && !errors.message
  }

  const submit = async () => {
    if (!validate()) return
    isSubmitting.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1400))
    isSubmitting.value = false
    isSuccess.value = true
    form.name = ''
    form.email = ''
    form.message = ''
    setTimeout(() => { isSuccess.value = false }, 5000)
  }

  const reset = () => {
    form.name = ''
    form.email = ''
    form.message = ''
    errors.name = undefined
    errors.email = undefined
    errors.message = undefined
    isSuccess.value = false
  }

  return { form, errors, isSubmitting, isSuccess, submit, reset }
}
