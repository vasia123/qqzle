<template>
  <div class="drawer drawer-mobile">
    <!-- <input id="left-sidebar-drawer" type="checkbox" class="drawer-toggle" /> -->
    <div class="drawer-content flex flex-col">
      <PageHeader />
      <!-- Page content here -->
      <main class="flex-1 overflow-y-auto pt-8 px-6 bg-base-200">
        <slot />
        <div class="h-16"></div>
      </main>
    </div>
    <!-- <div class="drawer-side">
      <label for="left-sidebar-drawer" class="drawer-overlay"></label>
      <LeftSidebar />
    </div> -->
  </div>
</template>
