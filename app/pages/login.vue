<script setup>
const auth = useAuthStore()

const email = ref('')
const password = ref('')

const submit = async () => {
  await auth.login(email.value, password.value)
  navigateTo('/dashboard')
}
</script>

<template>
<section class="min-h-screen grid place-items-center">
<div class="w-full max-w-md p-8 rounded-3xl border">

<h1 class="text-3xl font-bold mb-6">Login</h1>

<input v-model="email" placeholder="Email" class="input" />
<input v-model="password" type="password" class="input mt-4" />

<button @click="submit" class="btn-primary mt-4 w-full">
Login
</button>

<button
  @click="auth.googleLogin()"
  class="btn-secondary mt-4 w-full"
>
Continue with Google
</button>

</div>
</section>
</template>