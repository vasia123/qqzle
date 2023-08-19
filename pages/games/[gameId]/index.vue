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
      <!-- <div v-if="currentQuestion.image">
        <img :src="currentQuestion.image" alt="Изображение вопроса" />
      </div> -->
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
      <div v-else class="py-5">
        <FormInputText
          v-model="userAnswer"
          type="text"
          placeholder="Введите ваш ответ"
        />
      </div>
      <!-- Здесь можно добавить кнопку для отправки ответа -->
    </div>
    <div v-else>
      <p>Ожидание...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  doc,
  onSnapshot,
  getDoc,
  where,
  query,
  addDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Game, OngoingGame, Question, Round } from "~/types/db";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
  layout: "game",
});

const { gamesAndQuestionsCol, ongoingGamesCol, userAnswersCol } =
  useFirebaseDB();

const route = useRoute();
const user = useAuthStore();

let ongoingGameId: string;
if (Array.isArray(route.params.gameId))
  ongoingGameId = route.params.gameId.join("");
else ongoingGameId = route.params.gameId;

const ongoingGame = ref<OngoingGame | null>(null);
const currentQuestion = ref<Question | null>(null);
const currentRound = ref<Round | null>(null);
const selectedOption = ref<string | null>(null); // Для выбранного варианта ответа
const userAnswer = ref(""); // Для текстового ответа пользователя

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

// Функция для сохранения ответа пользователя
const loadUserAnswer = async () => {
  // Загрузите сохраненный ответ пользователя для нового вопроса
  const userAnswerQuery = query(
    userAnswersCol,
    where("questionID", "==", currentQuestion.value?.ID),
    where("userID", "==", user.userId)
  );
  const querySnapshot = await getDocs(userAnswerQuery);
  if (querySnapshot.docs.length > 0) {
    const savedAnswer = querySnapshot.docs[0].data().answer;
    if (currentQuestion.value?.guessType === "options") {
      selectedOption.value = savedAnswer as string;
    } else {
      userAnswer.value = savedAnswer as string;
    }
  }
};
const saveUserAnswer = async () => {
  const answer =
    currentQuestion.value?.guessType === "options"
      ? selectedOption.value
      : userAnswer.value;
  const questionID = currentQuestion.value?.ID || "";

  // Проверьте, существует ли уже ответ в базе данных
  const userAnswerQuery = query(
    userAnswersCol,
    where("questionID", "==", questionID),
    where("userID", "==", user.userId)
  );
  const querySnapshot = await getDocs(userAnswerQuery);

  if (querySnapshot.docs.length > 0) {
    // Если ответ существует, обновите его
    const userAnswerDoc = querySnapshot.docs[0];
    await updateDoc(userAnswerDoc.ref, { answer });
  } else {
    // Если ответа нет, добавьте новый
    const userAnswerData = {
      userID: user.userId,
      userName: user.userName,
      gameID: ongoingGameData.gameID,
      roundID: ongoingGame.value?.currentRoundIndex,
      correct: false,
      questionID,
      answer,
      timestamp: new Date(),
    };
    console.log("userAnswerData", ongoingGame.value);
    await addDoc(userAnswersCol, userAnswerData);
  }
};
// Отслеживание изменений в OngoingGame
const unsubscribe = onSnapshot(ongoingGameRef, async (docSnapshot) => {
  if (docSnapshot.exists()) {
    const newOngoingGame = docSnapshot.data() as OngoingGame;
    if (
      newOngoingGame.currentQuestionIndex !==
        ongoingGame.value?.currentQuestionIndex ||
      newOngoingGame.currentRoundIndex !==
        ongoingGame.value?.currentRoundIndex ||
      newOngoingGame.currentAnswersIndex !==
        ongoingGame.value?.currentAnswersIndex
    ) {
      // Сохраните текущий ответ пользователя перед переключением вопроса
      if (ongoingGame.value) {
        await saveUserAnswer();
      }
      ongoingGame.value = newOngoingGame;
      console.log("newOngoingGame", newOngoingGame);
      currentRound.value = gameData.rounds[ongoingGame.value.currentRoundIndex];
      currentQuestion.value =
        currentRound.value.questions[ongoingGame.value.currentQuestionIndex];
      userAnswer.value = "";
      selectedOption.value = "";
      await loadUserAnswer();
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
