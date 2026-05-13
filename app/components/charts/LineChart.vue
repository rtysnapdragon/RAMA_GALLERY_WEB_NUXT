<template>
  <div class="chart-line" ref="containerRef">
    <svg
      v-if="points.length"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      class="chart-line__svg"
    >
      <defs>
        <linearGradient :id="`grad-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   :stop-color="color" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.02" />
        </linearGradient>
        <filter :id="`glow-${uid}`">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Area fill -->
      <path
        :d="areaPath"
        :fill="`url(#grad-${uid})`"
      />

      <!-- Line -->
      <path
        :d="linePath"
        fill="none"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :filter="`url(#glow-${uid})`"
        class="chart-line__path"
      />

      <!-- Data points (last 7) -->
      <circle
        v-for="(pt, i) in sparsePoints"
        :key="i"
        :cx="pt.x"
        :cy="pt.y"
        r="3"
        :fill="color"
        class="chart-line__dot"
      />
    </svg>
    <div v-else class="chart-line__empty">No data</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: Array<{ date: string; count: number }>
  color?: string
  height?: number
}>()

const uid = Math.random().toString(36).slice(2, 8)
const W = 400
const H = computed(() => props.height ?? 80)
const PAD = 8
const color = computed(() => props.color ?? 'var(--accent)')

const points = computed(() => {
  const d = props.data
  if (!d?.length) return []
  const max = Math.max(...d.map(p => p.count), 1)
  const min = Math.min(...d.map(p => p.count), 0)
  const range = max - min || 1
  return d.map((p, i) => ({
    x: PAD + (i / (d.length - 1)) * (W - PAD * 2),
    y: H.value - PAD - ((p.count - min) / range) * (H.value - PAD * 2)
  }))
})

const sparsePoints = computed(() => {
  const step = Math.ceil(points.value.length / 8)
  return points.value.filter((_, i) => i % step === 0 || i === points.value.length - 1)
})

const linePath = computed(() => {
  if (!points.value.length) return ''
  return points.value.reduce((path, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = points.value[i - 1]
    const cpx = (prev.x + pt.x) / 2
    return `${path} C ${cpx} ${prev.y}, ${cpx} ${pt.y}, ${pt.x} ${pt.y}`
  }, '')
})

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const first = points.value[0]
  const last  = points.value[points.value.length - 1]
  return `${linePath.value} L ${last.x} ${H.value} L ${first.x} ${H.value} Z`
})
</script>

<style lang="scss">
.chart-line {
  position: relative;
  width: 100%;

  &__svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  &__path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 1.2s ease forwards;
  }

  &__dot {
    opacity: 0;
    animation: fadeIn 300ms ease forwards;
    animation-delay: 1s;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    color: var(--text-muted);
    font-size: 0.75rem;
  }
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
@keyframes fadeIn {
  to { opacity: 1; }
}
</style>
