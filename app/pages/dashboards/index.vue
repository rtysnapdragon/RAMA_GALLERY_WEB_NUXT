<template>
  <div class="page-dashboard">

    <!-- Header row -->
    <div class="page-header">
      <div>
        <h2 class="page-header__title">Analytics Overview</h2>
        <p class="page-header__sub">RamaGallery Content System · Real-time data</p>
      </div>
      <div class="page-header__actions">
        <select class="period-select" v-model="period">
          <option value="7">Last 7 days</option>
          <option value="30" selected>Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid-stats" style="margin-bottom: 24px;">
      <StatusCard
        icon="◎" label="Total Users" :value="stats.overview?.total_users ?? 0"
        color="#4D9DE0" :change="stats.today?.new_users" subtext="Registered accounts"
        :delay="0"
      />
      <StatusCard
        icon="⊞" label="Total Content" :value="stats.overview?.total_content ?? 0"
        color="#FF6B35" :change="stats.today?.new_content" subtext="Uploaded items"
        :delay="80"
      />
      <StatusCard
        icon="◻" label="Total Views" :value="stats.overview?.total_views ?? 0"
        color="#00D4AA" :change="stats.today?.new_views" subtext="Lifetime pageviews"
        :delay="160"
      />
      <StatusCard
        icon="♡" label="Total Likes" :value="stats.overview?.total_likes ?? 0"
        color="#EF476F" :change="stats.today?.new_likes" subtext="Engagement reactions"
        :delay="240"
      />
      <StatusCard
        icon="◈" label="Comments" :value="stats.overview?.total_comments ?? 0"
        color="#9B72CF" :change="stats.today?.new_comments" subtext="User comments"
        :delay="320"
      />
      <StatusCard
        icon="◫" label="Messages" :value="stats.overview?.total_messages ?? 0"
        color="#FFD166" subtext="Chat messages total"
        :delay="400"
      />
    </div>

    <!-- Charts row -->
    <div class="grid-2" style="margin-bottom: 24px;">

      <!-- Views chart -->
      <div class="card fade-up fade-up--delay-1">
        <div class="card-header">
          <div>
            <div class="card-header__title">Views Over Time</div>
            <div class="card-header__sub">Last 30 days · daily</div>
          </div>
          <div class="badge badge--teal">+{{ pct(stats.series?.views) }}% MoM</div>
        </div>
        <div style="height: 100px; margin-top: 16px;">
          <charts-line-chart :data="stats.series?.views ?? []" color="#00D4AA" />
        </div>
      </div>

      <!-- Users chart -->
      <div class="card fade-up fade-up--delay-2">
        <div class="card-header">
          <div>
            <div class="card-header__title">User Registrations</div>
            <div class="card-header__sub">Last 30 days · daily</div>
          </div>
          <div class="badge badge--info">+{{ pct(stats.series?.users) }}% MoM</div>
        </div>
        <div style="height: 100px; margin-top: 16px;">
          <charts-line-chart :data="stats.series?.users ?? []" color="#4D9DE0" />
        </div>
      </div>
    </div>

    <!-- Distributions + Content -->
    <div class="grid-3" style="margin-bottom: 24px;">

      <!-- Role distribution -->
      <div class="card fade-up">
        <div class="card-header">
          <div class="card-header__title">User Roles</div>
        </div>
        <div style="margin-top: 16px;">
          <charts-donut-chart
            :data="stats.distributions?.roles ?? {}"
            centerLabel="Roles"
          />
        </div>
      </div>

      <!-- Content status -->
      <div class="card fade-up fade-up--delay-1">
        <div class="card-header">
          <div class="card-header__title">Content Status</div>
        </div>
        <div style="margin-top: 16px;">
          <charts-donut-chart
            :data="stats.distributions?.content_status ?? {}"
            centerLabel="Items"
            :colors="['#00D4AA','#FFD166','#9B72CF','#EF476F']"
          />
        </div>
      </div>

      <!-- Log actions -->
      <div class="card fade-up fade-up--delay-2">
        <div class="card-header">
          <div class="card-header__title">Log Actions (7d)</div>
        </div>
        <div style="margin-top: 16px; height: 100px;">
          <charts-bar-chart
            :data="logActionBars"
            color="#FF6B35"
            :show-labels="true"
          />
        </div>
      </div>
    </div>

    <!-- Bottom: Top Content + Recent Logs -->
    <div class="grid-2">

      <!-- Top Content -->
      <div class="card fade-up">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="card-header__title">Top Content</div>
          <NuxtLink to="/content" class="btn btn--ghost" style="font-size: .75rem; padding: 4px 10px;">
            View all →
          </NuxtLink>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in stats.topContent.slice(0, 8)" :key="c.id">
                <td class="mono text-muted" style="width: 24px;">{{ i + 1 }}</td>
                <td class="truncate" style="max-width: 200px;">{{ c.title }}</td>
                <td class="mono">{{ c.views.toLocaleString() }}</td>
                <td class="mono">{{ c.likes.toLocaleString() }}</td>
                <td class="mono">{{ c.comments.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Logs -->
      <div class="card fade-up fade-up--delay-1">
        <div class="card-header" style="margin-bottom: 12px;">
          <div class="card-header__title">Recent Logs</div>
          <NuxtLink to="/logs" class="btn btn--ghost" style="font-size: .75rem; padding: 4px 10px;">
            View all →
          </NuxtLink>
        </div>
        <div class="log-feed">
          <div v-for="log in stats.recentLogs.slice(0, 12)" :key="log.id" class="log-item">
            <div class="log-item__action">
              <span :class="`badge badge--${actionBadge(log.action)}`">{{ log.action }}</span>
            </div>
            <div class="log-item__desc">{{ log.description || '—' }}</div>
            <div class="log-item__meta">
              <span class="mono text-muted">{{ log.ip || '—' }}</span>
              <span class="text-muted">{{ relTime(log.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

definePageMeta({ layout: 'dashboard' })

const store = useDashboardStore()
const stats = computed(() => store)
const period = ref('30')

const logActionBars = computed(() =>
  Object.entries(store.stats?.distributions?.log_actions ?? {})
    .map(([label, value]) => ({ label, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
)

const pct = (series?: Array<{count: number}>) => {
  if (!series?.length) return 0
  const half = Math.floor(series.length / 2)
  const prev = series.slice(0, half).reduce((s, d) => s + d.count, 0) || 1
  const curr = series.slice(half).reduce((s, d) => s + d.count, 0)
  return Math.round((curr - prev) / prev * 100)
}

const actionBadge = (action: string) => {
  const map: Record<string, string> = {
    LOGIN: 'info', REGISTER: 'success', UPLOAD: 'teal', DELETE: 'error',
    FLAG: 'warning', BAN: 'error', LIKE: 'primary', COMMENT: 'default',
  }
  return map[action] ?? 'default'
}

const relTime = (iso: string | null) => {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  return `${Math.floor(diff / 3600)}h`
}
</script>

<style lang="scss">
@use "@/assets/styles/_variables.scss" as *;
.page-dashboard { }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: $space-lg;
  gap: $space-md;

  &__title {
    font-family: $font-display;
    font-size: 1.375rem;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  &__sub {
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-family: $font-mono;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-sm;
  }
}

.period-select {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: $radius-md;
  color: var(--text-primary);
  font-family: $font-body;
  font-size: 0.8125rem;
  padding: 6px 10px;
  cursor: pointer;

  &:focus { outline: none; border-color: var(--accent); }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-sm;

  &__title {
    font-family: $font-display;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  &__sub {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: $font-mono;
    margin-top: 2px;
  }
}

.table-wrapper {
  overflow-x: auto;
  margin: 0 -#{$space-lg};
  padding: 0 $space-lg;
}

.log-feed {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 380px;
  overflow-y: auto;
}

.log-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
  gap: $space-sm;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-color);

  &:last-child { border-bottom: none; }

  &__desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-size: 0.65rem;
  }
}
</style>
