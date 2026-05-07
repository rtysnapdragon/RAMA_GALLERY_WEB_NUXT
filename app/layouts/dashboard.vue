<template>
<div class="min-h-screen flex bg-gray-100 dark:bg-neutral-950">

  <DashboardSidebar />

  <div class="flex-1 min-w-0">

    <DashboardHeader />

    <main class="p-6 md:p-10">
      <slot />
    </main>

  </div>

</div>
</template>