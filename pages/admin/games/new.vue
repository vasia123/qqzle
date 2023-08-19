<template>
  <TitleCard title="Добавление игры">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInputText v-model="title" type="text" label-title="Название" />
      <FormInputTextarea
        v-model="description"
        label-title="Описание"
      ></FormInputTextarea>
    </div>
    <div class="flex justify-between mt-8">
      <NuxtLink class="btn btn-ghost" to="/admin">Отмена</NuxtLink>
      <button class="btn btn-primary" :disabled="loading" @click="addGame">
        <span v-if="loading" class="loading loading-spinner"></span>
        Добавить игру
      </button>
    </div>
  </TitleCard>
  <ModalError :message="errorMessage" />
</template>
<script setup lang="ts">
import { addDoc } from "firebase/firestore";
// import { v4 as uuid } from "uuid";
import { useAuthStore } from "~/stores/auth";
import { Game } from "types/db";

definePageMeta({
  middleware: ["auth"],
});

const title = ref("");
const description = ref("");
const errorMessage = ref("");
const user = useAuthStore();
const { gamesAndQuestionsCol } = useFirebaseDB();
const loading = ref(false);

async function addGame() {
  if (title.value === "") {
    errorMessage.value = "введите Название";
    return;
  }
  loading.value = true;
  try {
    const game: Game = {
      // id: uuid(),
      userID: user.userId,
      name: title.value,
      description: description.value,
      rounds: [], // Массив вопросов
    };
    await addDoc(gamesAndQuestionsCol, game);
    await navigateTo("/admin");
  } catch (error) {
    loading.value = false;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      // eslint-disable-next-line no-console
      console.error("Unexpected error", error);
    }
  }
}
</script>
