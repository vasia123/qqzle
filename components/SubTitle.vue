<template>
  <div :class="['text-xl font-semibold', styleClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  styleClass?: string;
};
withDefaults(defineProps<Props>(), {
  styleClass: "",
});
</script>
