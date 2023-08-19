<template>
  <TitleCard :title="`Редактирование игры: ${title}`">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInputText v-model="title" type="text" label-title="Название" />
      <FormInputTextarea
        v-model="description"
        label-title="Описание"
      ></FormInputTextarea>
      <!-- <FormInputText
        v-model="code"
        type="text"
        label-title="Код для присоединения"
      /> -->
    </div>
    <!-- Здесь можно добавить поля для редактирования туров и вопросов -->
    <div class="flex justify-between mt-8">
      <NuxtLink class="btn btn-ghost" :to="'/admin/'">Отмена</NuxtLink>
      <button class="btn btn-primary" :disabled="loading" @click="updateGame">
        <span v-if="loading" class="loading loading-spinner"></span>
        Сохранить изменения
      </button>
    </div>
  </TitleCard>
  <ModalError :message="errorMessage" />
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Game } from "~/types/db";
// import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const { gamesAndQuestionsCol } = useFirebaseDB();

const route = useRoute();
const router = useRouter();

let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;

const errorMessage = ref("");
const loading = ref(false);
const title = ref("");
// const code = ref("");
const description = ref("");
// const user = useAuthStore();

// Получение данных игры при загрузке страницы
const fetchGame = async () => {
  try {
    const gameRef = doc(gamesAndQuestionsCol, gameId);
    const gameDoc = await getDoc(gameRef);
    if (gameDoc.exists()) {
      const gameData = gameDoc.data() as Game;
      title.value = gameData.name;
      // code.value = gameData.code;
      description.value = gameData.description;
      // Здесь можно установить другие поля игры
    } else {
      errorMessage.value = "Игра не найдена";
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      console.error("Unexpected error", error);
    }
  }
};

fetchGame();

// Функция для обновления игры
const updateGame = async () => {
  loading.value = true;
  try {
    const gameRef = doc(gamesAndQuestionsCol, gameId);
    await updateDoc(gameRef, {
      name: title.value,
      description: description.value,
      // code: code.value,
    });
    await router.push("/admin");
  } catch (error) {
    loading.value = false;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      console.error("Unexpected error", error);
    }
  }
};
</script>
