<script setup>
definePageMeta({
  layout: 'auth'
})

const auth = useAuthStore()

const email = ref('')
const password = ref('')

const localePath = useLocalePath()

const submit = async () => {
  await auth.login(email.value, password.value)
  navigateTo(localePath('/dashboard'))
}
</script>

<template>
  <div class="auth__form">

    <h2 class="auth__title">{{ $t('login')}}</h2>

    <input v-model="email" :placeholder="$t('email')" class="input" />
    <input v-model="password" type="password" :placeholder="$t('password')" class="input" />

    <button @click="submit" class="btn-primary">
      {{ $t('login')}}
    </button>

    <div class="auth__divider">{{ $t('or')}}</div>

    <button @click="auth.googleLogin()" class="btn-secondary">
      {{ $t('continue_with_google')}}
    </button>

  </div>
</template>

<style lang="scss" scoped>
.input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;

  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;

  color: #fff;
  font-size: 14px;

  outline: none;
  transition: 0.25s;

  &:focus {
    border-color: rgba(99,102,241,0.7);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  &::placeholder {
    color: rgba(255,255,255,0.4);
  }
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;

  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;

  color: white;
  font-weight: 600;
}

.btn-secondary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;

  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);

  color: #fff;
}

.auth__title {
  font-size: 28px;
  margin-bottom: 24px;
}

.auth__divider {
  text-align: center;
  margin: 20px 0;
  color: rgba(255,255,255,0.4);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .auth {
    flex-direction: column;

    &__left {
      padding: 40px;
      text-align: center;
      justify-content: center;
    }

    &__right {
      padding: 40px;
    }
  }
}
</style>