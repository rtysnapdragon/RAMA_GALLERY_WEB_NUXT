<template>
  <div class="chart-bar">
    <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="chart-bar__svg">
      <defs>
        <linearGradient :id="`bg-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.9" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.4" />
        </linearGradient>
      </defs>
      <g>
        <rect
          v-for="(bar, i) in bars"
          :key="i"
          :x="bar.x"
          :y="bar.y"
          :width="barW - 2"
          :height="bar.h"
          :fill="`url(#bg-${uid})`"
          rx="3"
          class="chart-bar__bar"
          :style="{ animationDelay: `${i * 40}ms` }"
        />
      </g>
    </svg>
    <div v-if="showLabels" class="chart-bar__labels">
      <span v-for="(bar, i) in bars" :key="i" class="chart-bar__label">
        {{ bar.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: Array<{ label: string; value: number }>
  color?: string
  showLabels?: boolean
}>()

const uid    = Math.random().toString(36).slice(2, 8)
const W      = 400
const H      = 100
const PAD    = 8
const color  = computed(() => props.color ?? 'var(--accent)')
const barW   = computed(() => (W - PAD * 2) / (props.data.length || 1))

const bars = computed(() => {
  const max = Math.max(...props.data.map(d => d.value), 1)
  const availH = H - PAD * 2
  return props.data.map((d, i) => {
    const h = (d.value / max) * availH
    return {
      x: PAD + i * barW.value,
      y: H - PAD - h,
      h: Math.max(h, 2),
      label: d.label,
      value: d.value
    }
  })
})
</script>

<style lang="scss">
.chart-bar {
  &__svg { width: 100%; height: 100px; display: block; }

  &__bar {
    transform-origin: bottom;
    transform: scaleY(0);
    animation: barUp 600ms cubic-bezier(.34,1.56,.64,1) forwards;
  }

  &__labels {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px 0;
  }

  &__label {
    font-size: 0.55rem;
    color: var(--text-muted);
    text-align: center;
    font-family: $font-mono;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    max-height: 50px;
    overflow: hidden;
  }
}

@keyframes barUp {
  to { transform: scaleY(1); }
}
</style>
