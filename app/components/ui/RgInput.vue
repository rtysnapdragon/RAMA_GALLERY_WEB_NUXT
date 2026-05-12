<script setup lang="ts">
// components/common/RgInput.vue
// Reusable form input/textarea

interface Props {
  modelValue: string
  label: string
  placeholder?: string
  type?: string
  textarea?: boolean
  error?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  textarea: false,
  rows: 5,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const isFocused = ref(false)
</script>

<template>
  <div class="rg-input" :class="{ 'rg-input--error': error, 'rg-input--focused': isFocused }">
    <label class="rg-input__label">{{ label }}</label>
    <textarea
      v-if="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      class="rg-input__field rg-input__textarea"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <input
      v-else
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="rg-input__field"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
    <span v-if="error" class="rg-input__error">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.rg-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color $duration-base ease;
  }

  &__field {
    @include body-text;
    width: 100%;
    padding: 0.875rem 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    outline: none;
    transition: border-color $duration-base ease;
    resize: none;

    &::placeholder { color: var(--text-muted); opacity: 0.5; }
  }

  &__textarea { min-height: 120px; }

  &--focused &__label { color: var(--gold); }
  &--focused &__field  { border-bottom-color: var(--gold); }
  &--error  &__field   { border-bottom-color: var(--terracotta); }

  &__error {
    font-size: 0.72rem;
    color: var(--terracotta);
    margin-top: -0.25rem;
  }
}
</style>
