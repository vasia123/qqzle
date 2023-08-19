<template>
  <div :class="`form-control w-full ${containerStyle}`">
    <label class="label">
      <span :class="`label-text text-base-content ${labelStyle}`">
        {{ labelTitle }}
      </span>
    </label>
    <textarea
      :value="modelValue"
      class="textarea textarea-bordered w-full"
      :placeholder="placeholder"
      @input="updateInputValue($event)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
type Props = {
  modelValue: string;
  labelTitle: string;
  labelStyle?: string;
  containerStyle?: string;
  // defaultValue?: string;
  placeholder?: string;
};

withDefaults(defineProps<Props>(), {
  labelStyle: "",
  containerStyle: "",
  // defaultValue: "",
  placeholder: "",
});

const emit = defineEmits(["update:modelValue"]);

function updateInputValue(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}
</script>
