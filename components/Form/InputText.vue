<template>
  <div :class="`form-control w-full ${containerStyle}`">
    <label v-if="labelTitle" class="label">
      <span :class="`label-text text-base-content ${labelStyle}`">
        {{ labelTitle }}
      </span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="input input-bordered w-full"
      @input="updateInputValue($event)"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  labelTitle?: string;
  modelValue: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  // defaultValue?: string;
  placeholder?: string;
};

withDefaults(defineProps<Props>(), {
  labelTitle: "",
  labelStyle: "",
  type: "text",
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
