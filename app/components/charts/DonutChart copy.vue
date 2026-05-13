<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle
      :cx="cx" :cy="cy" :r="r"
      fill="none"
      stroke="var(--border)"
      :stroke-width="strokeW"
    />
    <circle
      v-for="(seg, i) in segments" :key="i"
      :cx="cx" :cy="cy" :r="r"
      fill="none"
      :stroke="seg.color"
      :stroke-width="strokeW"
      :stroke-dasharray="`${seg.dash} ${circumference}`"
      :stroke-dashoffset="-seg.offset"
      stroke-linecap="round"
      style="transition: stroke-dasharray 0.6s ease"
    />
    <!-- Center label -->
    <text
      :x="cx" :y="cy - 8"
      text-anchor="middle"
      dominant-baseline="central"
      :style="`font-family: var(--font-head); font-size: ${labelSize}px; font-weight: 800; fill: var(--text-1); letter-spacing: -0.03em;`"
    >{{ centerLabel }}</text>
    <text
      :x="cx" :y="cy + labelSize * 0.8"
      text-anchor="middle"
      dominant-baseline="central"
      :style="`font-family: var(--font-body); font-size: ${subSize}px; fill: var(--text-3);`"
    >{{ centerSub }}</text>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number
  strokeWidth?: number
  segments: { value: number; color: string }[]
  centerLabel?: string
  centerSub?: string
}>()

const size = computed(() => props.size ?? 120)
const strokeW = computed(() => props.strokeWidth ?? 14)
const cx = computed(() => size.value / 2)
const cy = computed(() => size.value / 2)
const r = computed(() => (size.value - strokeW.value) / 2 - 4)
const circumference = computed(() => 2 * Math.PI * r.value)
const labelSize = computed(() => size.value * 0.18)
const subSize = computed(() => size.value * 0.1)

const total = computed(() => props.segments.reduce((s, seg) => s + seg.value, 0))

const segments = computed(() => {
  let offset = 0
  return props.segments.map(seg => {
    const dash = (seg.value / total.value) * circumference.value
    const result = { color: seg.color, dash, offset }
    offset += dash
    return result
  })
})
</script>
