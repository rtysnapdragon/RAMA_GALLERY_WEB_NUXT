<script setup lang="ts">
const { store } = useDashboard()
</script>

<template>

  <div class="dashboard-grid">

    <StatsCard
      title="Users"
      :value="store.stats?.TOTAL_USERS"
    />

    <StatsCard
      title="Views"
      :value="store.stats?.TOTAL_VIEWS"
    />

    <AnalyticsCard>

      <LineChart />

    </AnalyticsCard>

    <ActivityCard
      :items="store.activity"
    />

  </div>

</template>