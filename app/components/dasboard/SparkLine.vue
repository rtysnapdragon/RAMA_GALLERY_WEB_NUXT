<template>
  <svg
    :width="width || '100%'"
    :height="height"
    :viewBox="`0 0 ${vw} ${height}`"
    preserveAspectRatio="none"
    style="overflow:visible"
  >
    <defs>
      <linearGradient :id="`grad-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.18"/>
        <stop offset="100%" :stop-color="color" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Area -->
    <path :d="areaPath" :fill="`url(#grad-${uid})`"/>

    <!-- Line -->
    <path :d="linePath" fill="none" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Highlight dot -->
    <circle v-if="highlightIdx >= 0" :cx="points[highlightIdx]?.x" :cy="points[highlightIdx]?.y" r="4" :fill="color"/>
    <circle v-if="highlightIdx >= 0" :cx="points[highlightIdx]?.x" :cy="points[highlightIdx]?.y" r="7" :fill="color" opacity="0.15"/>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: number[]
  color?: string
  height?: number
  width?: number | string
  highlightIdx?: number
}>()

const uid = Math.random().toString(36).slice(2)
const vw = 300
const h = computed(() => props.height ?? 80)
const color = computed(() => props.color ?? 'var(--accent)')
const highlightIdx = computed(() => props.highlightIdx ?? -1)

const points = computed(() => {
  const data = props.data
  if (!data.length) return []
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 6
  return data.map((v, i) => ({
    x: (i / (data.length - 1)) * vw,
    y: pad + ((1 - (v - min) / range) * (h.value - pad * 2)),
  }))
})

const linePath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = pts[i - 1]
    const cpx = (prev.x + p.x) / 2
    return `${d} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`
  }, '')
})

const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  return `${linePath.value} L ${pts[pts.length - 1].x} ${h.value} L ${pts[0].x} ${h.value} Z`
})
</script>
