<template>
  <input
    id="message-modal"
    v-model="messageModalInput"
    type="checkbox"
    class="modal-toggle"
  />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Ошибка!</h3>
      <p class="py-4">
        {{ message }}
      </p>
      <div class="modal-action">
        <label for="message-modal" class="btn">Понял!</label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  message?: string;
}
const props = defineProps<Props>();
const messageModalInput = ref(false);
watch(props, () => {
  if (props.message) {
    messageModalInput.value = true;
  }
});
</script>
