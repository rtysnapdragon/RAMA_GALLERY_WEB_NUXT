<template>
  <div class="chart-donut">
    <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="chart-donut__svg">
      <g :transform="`translate(${SIZE/2}, ${SIZE/2})`">
        <circle
          :r="R"
          fill="none"
          stroke="var(--bg-elevated)"
          :stroke-width="STROKE"
        />
        <path
          v-for="(seg, i) in segments"
          :key="i"
          :d="seg.d"
          fill="none"
          :stroke="seg.color"
          :stroke-width="STROKE"
          stroke-linecap="butt"
          class="chart-donut__seg"
          :style="{ animationDelay: `${i * 120}ms` }"
        />
      </g>
    </svg>

    <!-- Center -->
    <div class="chart-donut__center">
      <div class="chart-donut__total">{{ total.toLocaleString() }}</div>
      <div class="chart-donut__label">{{ centerLabel }}</div>
    </div>

    <!-- Legend -->
    <div class="chart-donut__legend">
      <div v-for="(item, i) in segments" :key="i" class="chart-donut__legend-item">
        <span class="chart-donut__legend-dot" :style="{ background: item.color }" />
        <span class="chart-donut__legend-name">{{ item.label }}</span>
        <span class="chart-donut__legend-val">{{ item.value.toLocaleString() }}</span>
        <span class="chart-donut__legend-pct">{{ item.pct }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const COLORS = ['#FF6B35','#00D4AA','#4D9DE0','#9B72CF','#FFD166','#EF476F']
const SIZE   = 140
const R      = 54
const STROKE = 18
const GAP    = 3

const props = withDefaults(defineProps<{
  data?: Record<string, number>
  centerLabel?: string
  colors?: string[]
}>(), {
  data: () => ({}),
  centerLabel: '',
})

const total = computed(() => Object.values(props.data).reduce((a, b) => a + b, 0))
const circumference = 2 * Math.PI * R

const segments = computed(() => {
  const colors = props.colors ?? COLORS
  const entries = Object.entries(props.data)
  const tot = total.value || 1
  let offset = -Math.PI / 2

  return entries.map(([label, value], i) => {
    const pct     = value / tot
    const angle   = pct * (circumference - GAP * entries.length)
    const gapAngle= GAP / R

    const startX = Math.cos(offset) * R
    const startY = Math.sin(offset) * R
    const endAngle = offset + pct * 2 * Math.PI - gapAngle
    const endX = Math.cos(endAngle) * R
    const endY = Math.sin(endAngle) * R
    const large = pct > 0.5 ? 1 : 0

    const d = `M ${startX} ${startY} A ${R} ${R} 0 ${large} 1 ${endX} ${endY}`
    offset   = endAngle + gapAngle

    return {
      label, value, color: colors[i % colors.length], d,
      pct: Math.round(pct * 100)
    }
  })
})
</script>

<style lang="scss">
.chart-donut {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-md;

  &__svg {
    width: 140px;
    height: 140px;
    flex-shrink: 0;
  }

  &__seg {
    stroke-dasharray: v-bind(circumference);
    stroke-dashoffset: v-bind(circumference);
    animation: dashIn 800ms ease forwards;
  }

  &__center {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 140px; height: 140px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none;
  }

  &__total {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  &__label {
    font-size: 0.625rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-top: 2px;
  }

  &__legend {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
  }

  &__legend-dot {
    width: 8px; height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  &__legend-name {
    color: var(--text-secondary);
    flex: 1;
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: .04em;
  }

  &__legend-val {
    font-family: $font-mono;
    font-size: 0.7rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  &__legend-pct {
    font-family: $font-mono;
    font-size: 0.65rem;
    color: var(--text-muted);
    width: 32px;
    text-align: right;
  }
}

@keyframes dashIn {
  to { stroke-dashoffset: 0; }
}
</style>
