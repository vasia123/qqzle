<template>
  <div :class="`form-control w-full ${containerStyle}`">
    <label class="label">
      <span :class="`label-text text-base-content ${labelStyle}`">
        {{ labelTitle }}
      </span>
    </label>
    <input
      type="file"
      class="file-input file-input-bordered w-full"
      @change="handleFileChange($event)"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
};

withDefaults(defineProps<Props>(), {
  labelStyle: "",
  containerStyle: "",
});

const emit = defineEmits(["file-selected"]);

function handleFileChange(e: Event) {
  const fileInput = e.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (file) {
    emit("file-selected", file);
  }
}
</script>
