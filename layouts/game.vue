<template>
  <div class="drawer drawer-mobile">
    <div class="drawer-content flex flex-col">
      <main
        class="flex-1 overflow-y-auto pt-8 px-6 bg-base-200 h-full w-full main-container"
      >
        <slot />
        <div class="h-16"></div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.drawer {
  height: 100vh; /* Высота во всю высоту окна просмотра */
  width: 100vw; /* Ширина во всю ширину окна просмотра */
}
.main-container {
  background-color: #1e1e2f;
  color: #f7f7f7;
}
</style>
