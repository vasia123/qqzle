<template>
  <div>
    <div
      v-if="
        ongoingGame &&
        ongoingGame.status === 'started' &&
        currentQuestion &&
        currentRound &&
        ongoingGame.currentAnswersIndex < 0
      "
    >
      <div>{{ currentRound.name }}</div>
      <div class="py-5">
        Вопрос: <b>{{ currentQuestion.text }}</b>
      </div>
      <div v-if="currentQuestion.image">
        <img :src="currentQuestion.image" alt="Изображение вопроса" />
      </div>
      <div
        v-if="currentQuestion.guessType === 'options'"
        class="grid grid-cols-2 gap-4"
      >
        <button
          v-for="option in currentQuestion.guessOptions"
          :key="option"
          class="btn"
          :class="{
            'btn-accent': selectedOption === option,
            'btn-primary': selectedOption !== option,
          }"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
    <div
      v-if="
        ongoingGame &&
        ongoingGame.status === 'started' &&
        currentQuestion &&
        currentRound &&
        ongoingGame.currentAnswersIndex >= 0 &&
        currentAnswer
      "
    >
      <div>{{ currentRound.name }}</div>
      <div class="py-5">
        Вопрос: <b>{{ currentAnswer.text }}</b>
      </div>
      <div v-if="currentAnswer.image">
        <img :src="currentAnswer.image" alt="Изображение вопроса" />
      </div>
      <div
        v-if="currentAnswer.guessType === 'options'"
        class="grid grid-cols-2 gap-4"
      >
        <button
          v-for="option in currentAnswer.guessOptions"
          :key="option"
          class="btn"
          :class="{
            'btn-accent': currentAnswer.answer === option,
            'btn-primary': currentAnswer.answer !== option,
          }"
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>
      <div class="py-5">
        Ответ: <b>{{ currentAnswer.answer }}</b>
      </div>
    </div>
    <div v-else>
      <p>Ожидание начала игры...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { Game, OngoingGame, Question, Round } from "~/types/db";

definePageMeta({
  middleware: ["auth"],
  layout: "game",
});

const { gamesAndQuestionsCol, ongoingGamesCol } = useFirebaseDB();

const route = useRoute();

let ongoingGameId: string;
if (Array.isArray(route.params.gameId))
  ongoingGameId = route.params.gameId.join("");
else ongoingGameId = route.params.gameId;

const ongoingGame = ref<OngoingGame | null>(null);
const currentQuestion = ref<Question | null>(null);
const currentAnswer = ref<Question | null>(null);
const currentRound = ref<Round | null>(null);
const selectedOption = ref<string | null>(null); // Для выбранного варианта ответа

// Получение данных игры
const ongoingGameRef = doc(ongoingGamesCol, ongoingGameId);
const ongoingGameDoc = await getDoc(ongoingGameRef);
if (!ongoingGameDoc.exists()) {
  throw showError({
    statusCode: 404,
    statusMessage: "Игра не найдена",
  });
}
const ongoingGameData = ongoingGameDoc.data() as OngoingGame;

// Получение данных игры
const gameRef = doc(gamesAndQuestionsCol, ongoingGameData.gameID);
const gameDoc = await getDoc(gameRef);
if (!gameDoc.exists()) {
  throw showError({
    statusCode: 404,
    statusMessage: "Игра не найдена",
  });
}
const gameData = gameDoc.data() as Game;

// Отслеживание изменений в OngoingGame
const unsubscribe = onSnapshot(ongoingGameRef, (docSnapshot) => {
  if (docSnapshot.exists()) {
    const newOngoingGame = docSnapshot.data() as OngoingGame;
    if (
      newOngoingGame.currentQuestionIndex !==
        ongoingGame.value?.currentQuestionIndex ||
      newOngoingGame.currentRoundIndex !== ongoingGame.value?.currentRoundIndex
    ) {
      ongoingGame.value = newOngoingGame;
      currentRound.value = gameData.rounds[ongoingGame.value.currentRoundIndex];
      currentQuestion.value =
        currentRound.value.questions[ongoingGame.value.currentQuestionIndex];
      if (ongoingGame.value.currentAnswersIndex > -1) {
        currentAnswer.value =
          currentRound.value.questions[ongoingGame.value.currentAnswersIndex];
      } else {
        currentAnswer.value = null;
      }
    }
  }
});

// Отписка от слушателя при разрушении компонента
watchEffect((onInvalidate) => {
  onInvalidate(() => {
    unsubscribe();
  });
});
const selectOption = (option: string) => {
  selectedOption.value = option;
};
</script>
<style scoped>
:deep(.input) {
  color: #1e1e2f;
}
</style>
