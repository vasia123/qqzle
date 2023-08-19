<template>
  <input
    :id="modalId"
    v-model="modalInput"
    type="checkbox"
    class="modal-toggle"
  />
  <div class="modal">
    <div class="modal-box">
      <slot name="content">
        <p class="py-4">Содержимое</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modalId: string;
  showModal?: boolean;
}

const props = defineProps<Props>();
const modalInput = ref(props.showModal || false);

watch(props, () => {
  if (props.showModal !== undefined) {
    modalInput.value = props.showModal;
  }
});

const modalId = props.modalId;
</script>
