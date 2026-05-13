<script setup lang="ts">
import VChart from "vue-echarts"

const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed']
  },

  yAxis: {
    type: 'value'
  },

  series: [
    {
      data: [120, 200, 150],
      type: 'line'
    }
  ]
}

series: [
  {
    type: 'line',
    areaStyle: {},
    data: [22, 33, 11]
  }
]
</script>

<template>
  <VChart
    :option="option"
    autoresize
    style="height:300px"
  />
</template>