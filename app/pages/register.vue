<template>
  <section class="auth-wrap">
    <div class="auth-container">
      
      <!-- Left Side (Brand / Info) -->
      <div class="auth-left">
        <h1 class="logo">RamaGallery</h1>
        <h2>Create your account</h2>
        <p>
          Join the platform to showcase artwork, collect masterpieces,
          and connect with artists worldwide.
        </p>
      </div>

      <!-- Right Side (Form) -->
      <div class="auth-right">
        <form @submit.prevent="handleRegister" class="auth-form">
          <h2>Register</h2>

          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Username</label>
            <input v-model="form.username" type="text" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input v-model="form.password" type="password" required />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>

          <p v-if="error" class="error">{{ error }}</p>

          <p class="switch">
            Already have an account?
            <NuxtLink :to="localePath('/login')">Login</NuxtLink>
          </p>
        </form>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const auth = useAuthStore()
console.log(" Auth===============> ", auth)

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleRegister = async () => {
  console.log("handleRegister")
  loading.value = true
  error.value = null

  try {
    const {ok} = await auth?.register({
      Name: form.name,
      Username: form.username,
      Email: form.email,
      Password: form.password,
    })
    if (ok) {
      await navigateTo(localePath('/'))
    }
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: false,
})
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  background: #0b0f19;
  color: #fff;
  display: flex;
}

.auth-container {
  display: flex;
  width: 100%;
}

/* LEFT SIDE */
.auth-left {
  flex: 1;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: radial-gradient(circle at top left, #1a2238, #0b0f19);
}

.logo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
}

.auth-left h2 {
  font-size: 36px;
  margin-bottom: 20px;
}

.auth-left p {
  max-width: 400px;
  color: #9ca3af;
  line-height: 1.6;
}

/* RIGHT SIDE */
.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

.auth-form h2 {
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #9ca3af;
}

input {
  padding: 12px;
  border: 1px solid #2a2f45;
  background: #111827;
  color: #fff;
  border-radius: 8px;
  outline: none;
}

input:focus {
  border-color: #6366f1;
}

/* BUTTON */
button {
  width: 100%;
  padding: 12px;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #4f46e5;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ERROR */
.error {
  margin-top: 12px;
  color: #f87171;
}

/* SWITCH */
.switch {
  margin-top: 20px;
  font-size: 14px;
  color: #9ca3af;
}

.switch a {
  color: #6366f1;
  text-decoration: none;
}

.switch a:hover {
  text-decoration: underline;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-left {
    padding: 40px;
  }

  .auth-right {
    padding: 40px;
  }
}
</style>