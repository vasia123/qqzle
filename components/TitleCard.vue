<template>
  <div class="card w-full p-6 bg-base-100 shadow-xl" :class="outerClass">
    <!-- Title for Card -->
    <SubTitle :style-class="hasSlot('topSideButtons') ? 'inline-block' : ''">
      {{ title }}
      <!-- Top side button, show only if present -->
      <div v-if="hasSlot('topSideButtons')" class="inline-block float-right">
        <slot name="topSideButtons" />
      </div>
    </SubTitle>

    <div class="divider mt-2"></div>

    <!-- Card Body -->
    <div class="h-full w-full pb-6 bg-base-100">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots();
const hasSlot = (name: string) => {
  return !!slots[name];
};

type Props = {
  title?: string;
  outerClass?: string;
};
withDefaults(defineProps<Props>(), {
  title: "",
  outerClass: "",
});
</script>
