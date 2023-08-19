<template>
  <TitleCard title="Список игр">
    <div v-if="listGames.length > 0">
      <div class="overflow-x-auto w-full">
        <div>
          <div v-for="game in listGames" :key="game.id" class="my-2 p-2">
            <div class="mb-1">{{ game.data.name }}</div>
            <NuxtLink
              class="btn btn-primary mr-2"
              :to="'/admin/games/' + game.id + '/rounds'"
              >Туры</NuxtLink
            >
            <NuxtLink
              class="btn btn-accent mr-2"
              :to="'/admin/games/' + game.id + '/edit'"
              >Редактировать</NuxtLink
            >
            <NuxtLink
              class="btn btn-error mr-2"
              :to="'/admin/games/' + game.id + '/delete'"
              >Удалить</NuxtLink
            >
            <NuxtLink
              class="btn btn-secondary mr-2"
              :to="'/admin/games/' + game.id + '/start'"
              >Запустить</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else>пока пусто</div>
    <NuxtLink class="btn btn-primary mt-8" to="/admin/games/new"
      >Добавить игру</NuxtLink
    >
  </TitleCard>
  <ModalError :message="errorMessage" />
</template>
<script setup lang="ts">
import { where, getDocs, query } from "firebase/firestore";
import { Game } from "types/db";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const user = useAuthStore();
const { gamesAndQuestionsCol } = useFirebaseDB();
const errorMessage = ref("");
const listGames = ref<{ id: string; data: Game }[]>([]);
try {
  const gamesQuery = query(
    gamesAndQuestionsCol,
    where("userID", "==", user.userId)
  );
  const querySnapshot = await getDocs(gamesQuery);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    listGames.value.push({
      id: doc.id,
      data,
    });
  });
  // console.log("Список игр:", listGames.value);
} catch (error) {
  if (error instanceof Error) {
    errorMessage.value = error.message;
  } else {
    // eslint-disable-next-line no-console
    console.error("Unexpected error", error);
  }
}
</script>
