<template>
  <TitleCard :title="`Туры игры: ${gameName}`">
    <div v-if="rounds.length > 0">
      <div class="overflow-x-auto w-full">
        <div
          v-for="(round, roundIndex) in rounds"
          :key="round.name"
          class="my-2 p-2"
        >
          <div class="mb-1">{{ round.name }}</div>
          <img v-if="round.image" :src="round.image" alt="Изображение тура" />
          <NuxtLink
            class="btn btn-primary mr-2"
            :to="'/admin/games/' + gameId + '/rounds/' + roundIndex + '-edit'"
            >Редактировать</NuxtLink
          >
          <NuxtLink
            class="btn btn-accent mr-2"
            :to="
              '/admin/games/' + gameId + '/rounds/' + roundIndex + '-questions'
            "
            >Вопросы</NuxtLink
          >
          <button
            class="btn btn-error mr-2"
            @click="showDeleteConfirmation(roundIndex)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div v-else>Нет туров</div>
    <div class="flex justify-between mt-8">
      <NuxtLink class="btn btn-ghost" :to="'/admin/'">к списку игр</NuxtLink>
      <NuxtLink
        class="btn btn-primary"
        :to="'/admin/games/' + gameId + '/rounds/new'"
        >Добавить тур</NuxtLink
      >
    </div>
  </TitleCard>
  <ModalError :message="errorMessage" />
  <ModalDialog modal-id="delete-modal" :show-modal="showDeleteModal">
    <template #title>
      <h3 class="font-bold text-lg">Подтверждение удаления</h3>
    </template>
    <template #content>
      <p class="py-4">Вы уверены, что хотите удалить этот раунд?</p>
    </template>
    <template #actions>
      <label for="delete-modal" class="btn">Отмена</label>
      <button class="btn btn-error" :disabled="loading" @click="deleteRound">
        <span v-if="loading" class="loading loading-spinner"></span> Удалить
      </button>
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Game, Round } from "~/types/db";

const route = useRoute();
const { gamesAndQuestionsCol } = useFirebaseDB();
let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;
const errorMessage = ref("");
const gameName = ref("");
const rounds = ref<Round[]>([]);
const loading = ref(false);

// Получение данных игры при загрузке страницы
const fetchGame = async () => {
  try {
    const gameRef = doc(gamesAndQuestionsCol, gameId);
    const gameDoc = await getDoc(gameRef);
    if (gameDoc.exists()) {
      const gameData = gameDoc.data() as Game;
      gameName.value = gameData.name;
      rounds.value = gameData.rounds;
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

const showDeleteModal = ref(false);
let roundToDelete = -1;

const showDeleteConfirmation = (roundId: number) => {
  roundToDelete = roundId;
  showDeleteModal.value = true;
};
// Функция для удаления тура
const deleteRound = async () => {
  if (roundToDelete > -1) {
    loading.value = true;
    try {
      const updatedRounds = rounds.value.splice(roundToDelete, 1);
      const gameRef = doc(gamesAndQuestionsCol, gameId);
      await updateDoc(gameRef, { rounds: updatedRounds });
      rounds.value = updatedRounds;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        console.error("Unexpected error", error);
      }
    }
    loading.value = false;
    // Закрыть модальное окно
    showDeleteModal.value = false;
    roundToDelete = -1;
  }
};
</script>
