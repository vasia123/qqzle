<template>
  <div>
    <!-- <NuxtLink class="btn btn-primary mt-8" to="/admin/"
      >Управление играми</NuxtLink
    > -->
    <button class="btn btn-primary" @click="showGameModal = true">
      Присоединиться к игре
    </button>
  </div>
  <ModalDialog modal-id="delete-modal" :show-modal="showGameModal">
    <template #title>
      <h3 class="font-bold text-lg">Введите код игры</h3>
    </template>
    <template #content>
      <FormInputText v-model="gameCode" label-title="Код"></FormInputText>
    </template>
    <template #actions>
      <label class="btn" @click="showGameModal = false">Отмена</label>
      <button class="btn btn-accent" @click="joinGame">Присоединиться</button>
    </template>
  </ModalDialog>
  <ModalError :message="errorMessage" />
</template>
<script setup lang="ts">
import { where, getDocs, query } from "firebase/firestore";
definePageMeta({
  middleware: ["auth"],
});

const showGameModal = ref(false);
const gameCode = ref("");
const errorMessage = ref("");
const { ongoingGamesCol } = useFirebaseDB();

const joinGame = async () => {
  try {
    const gamesQuery = query(
      ongoingGamesCol,
      where("code", "==", gameCode.value)
    );
    const querySnapshot = await getDocs(gamesQuery);
    const game = querySnapshot.docs[0];
    if (game) {
      const gameId = game.id;
      // Добавление пользователя в игру (если необходимо)
      navigateTo("/games/" + gameId);
    } else {
      errorMessage.value = "игра не найдена";
    }
    // console.log("Список игр:", listGames.value);
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      // eslint-disable-next-line no-console
      console.error("Unexpected error", error);
    }
  }
};
</script>
