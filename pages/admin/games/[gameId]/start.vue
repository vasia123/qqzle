<template>
  <div>
    <FormInputText
      v-if="!gameStarted"
      v-model="code"
      type="text"
      label-title="Код для присоединения"
    />
    <button v-if="!gameStarted" class="btn btn-primary mr-2" @click="startGame">
      Начать игру
    </button>
    <div
      v-if="
        !gameEnd &&
        gameStarted &&
        currentQuestion &&
        currentRound &&
        !showingAnswers
      "
    >
      <h2>Раунд: {{ currentRound.name }}</h2>
      <h1>
        Вопрос: <b>{{ currentQuestion.text }}</b>
      </h1>
      <div v-if="currentQuestion.sound">
        <audio :src="currentQuestion.sound" controls></audio>
      </div>
      <button
        class="btn btn-primary mr-2"
        :disabled="currentQuestionIndex === 0 && currentRoundIndex == 0"
        @click="prevQuestion"
      >
        Предыдущий Вопрос
      </button>
      <button class="btn btn-primary mr-2" @click="nextQuestion">
        Следующий Вопрос
      </button>
      <button
        v-if="allQuestionsAnswered"
        class="btn btn-primary mr-2"
        @click="showAnswers"
      >
        Показать Ответы
      </button>
    </div>

    <div v-if="!gameEnd && showingAnswers && currentAnswer">
      <div v-if="!showResults">
        <div>
          Вопрос: <b>{{ currentAnswer.text }}</b>
        </div>
        <div>
          Ответ:<b>{{ currentAnswer.answer }}</b>
        </div>
        <div v-for="(answer, index) in userAnswers" :key="index" class="py-5">
          <b>{{ answer.userName }}</b> - Ответ:
          <b>{{ answer.answer }}</b>
          <button
            class="btn mx-2"
            :class="{
              'btn-accent': answer.correct,
              'btn-error': !answer.correct,
            }"
            @click="toggleAnswerCorrect(index)"
          >
            {{ answer.correct ? "Правильно" : "Не правильно" }}
          </button>
        </div>
        <button
          class="btn btn-primary mr-2"
          :disabled="currentQuestionIndex === 0 && currentRoundIndex == 0"
          @click="prevAnswer"
        >
          Предыдущий Вопрос
        </button>
        <button class="btn btn-primary mr-2" @click="nextAnswer">
          Следующий Вопрос
        </button>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th
                v-for="roundName in Object.keys(gameData.rounds)"
                :key="roundName"
              >
                {{ roundName }}
              </th>
              <th>Общий балл</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in userResults" :key="result.userId">
              <td>{{ result.userId }}</td>
              <td
                v-for="roundName in Object.keys(gameData.rounds)"
                :key="roundName"
              >
                {{ result.scores[roundName] || 0 }}
              </td>
              <td>{{ result.totalScore }}</td>
            </tr>
          </tbody>
        </table>

        <button class="btn btn-primary mr-2" @click="hideResult">
          Следующий тур
        </button>
      </div>
    </div>
  </div>
  <div v-if="gameEnd">Игра закончена</div>
  <div class="mt-8">
    <a :href="'/games/' + ongoingGameDoc.id + '/show'" target="_blank"
      >открыть просмотр</a
    >
  </div>

  <ModalError :message="errorMessage" />
</template>
<script setup lang="ts">
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  getDocs,
  query,
  where,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { Game, OngoingGame, Question, Round, UserAnswer } from "~/types/db";

definePageMeta({
  middleware: ["auth"],
});

const { gamesAndQuestionsCol, ongoingGamesCol, userAnswersCol } =
  useFirebaseDB();
const showingAnswers = ref(false); // Добавьте это состояние для управления показом ответов
const route = useRoute();

let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;

const errorMessage = ref("");
const code = ref("");

// Получение данных игры при загрузке страницы
const gameRef = doc(gamesAndQuestionsCol, gameId);
const gameDoc = await getDoc(gameRef);
if (!gameDoc.exists()) {
  throw showError({
    statusCode: 404,
    statusMessage: "Игра не найдена",
  });
}
const gameData = gameDoc.data() as Game;

type UserResult = {
  [key: string]: {
    userId: string;
    scores: { [roundName: string]: number };
    totalScore: number;
  };
};

const userResults = ref<UserResult>({});

let ongoingGameQuery = query(ongoingGamesCol, where("gameID", "==", gameId));
let querySnapshot = await getDocs(ongoingGameQuery);
if (querySnapshot.docs.length < 1) {
  await addDoc(ongoingGamesCol, {
    code: "",
    gameID: gameId,
    status: "init",
    currentRoundIndex: 0,
    currentQuestionIndex: 0,
    currentAnswersIndex: -1,
  });
  ongoingGameQuery = query(ongoingGamesCol, where("gameID", "==", gameId));
  querySnapshot = await getDocs(ongoingGameQuery);
}
const ongoingGameDoc = querySnapshot.docs[0];
const ongoingGame: OngoingGame = ongoingGameDoc.data() as OngoingGame;
const ongoingGameRef = doc(ongoingGamesCol, ongoingGameDoc.id);

// вывод списка раундов
const currentRoundIndex = ref(ongoingGame.currentRoundIndex);
const currentQuestionIndex = ref(ongoingGame.currentQuestionIndex);
const currentAnswersIndex = ref(ongoingGame.currentAnswersIndex);
const currentQuestion = ref<Question>();
const currentAnswer = ref<Question>();
const currentRound = ref<Round>();
const gameEnd = ref(false);
const showResults = ref(false);
const userAnswers = ref<UserAnswer[]>([]);
const userAnswersRefs = ref<DocumentReference<UserAnswer, DocumentData>[]>([]);

currentQuestion.value =
  gameData.rounds[currentRoundIndex.value].questions[
    currentQuestionIndex.value
  ];

currentRound.value = gameData.rounds[currentRoundIndex.value];

const gameStarted = ref(ongoingGame.status === "started");
const allQuestionsAnswered = computed(
  () =>
    currentQuestionIndex.value >=
    gameData.rounds[currentRoundIndex.value].questions.length
);

const startGame = async () => {
  await updateDoc(ongoingGameRef, {
    code: code.value,
    status: "started",
    currentRoundIndex: 0,
    currentQuestionIndex: -1,
  });
  gameStarted.value = true;
  currentQuestion.value = gameData.rounds[0].questions[0];
};
const nextQuestion = async () => {
  if (
    currentQuestionIndex.value <
    gameData.rounds[currentRoundIndex.value].questions.length - 1
  ) {
    currentQuestionIndex.value++;
    await updateDoc(ongoingGameRef, {
      currentAnswersIndex: -1,
      currentQuestionIndex: currentQuestionIndex.value,
    });
    currentQuestion.value =
      gameData.rounds[currentRoundIndex.value].questions[
        currentQuestionIndex.value
      ];
  } else {
    showingAnswers.value = true;
    currentAnswersIndex.value = 0;
    currentAnswer.value =
      gameData.rounds[currentRoundIndex.value].questions[
        currentAnswersIndex.value
      ];
    await updateDoc(ongoingGameRef, {
      currentAnswersIndex: currentAnswersIndex.value,
    });
    await loadAnswers(currentAnswer.value);
  }
};

const prevAnswer = async () => {
  if (currentAnswersIndex.value > 0) {
    currentAnswersIndex.value--;
    await updateDoc(ongoingGameRef, {
      currentAnswersIndex: currentAnswersIndex.value,
    });
    currentRound.value = gameData.rounds[currentRoundIndex.value]; // Обновление текущего раунда
    currentAnswer.value =
      gameData.rounds[currentRoundIndex.value].questions[
        currentAnswersIndex.value
      ];
  } else {
    hideAnswers();
    currentAnswersIndex.value = -1;
    await updateDoc(ongoingGameRef, {
      currentAnswersIndex: -1,
    });
  }
};

const loadAnswers = async (answer: Question) => {
  // Получите ответы пользователей для текущего раунда (вам нужно будет адаптировать этот код в соответствии с вашей структурой данных)
  const answersQuery = query(
    userAnswersCol,
    where("roundID", "==", currentRoundIndex.value),
    where("questionID", "==", answer.ID),
    where("gameID", "==", gameId)
  );
  const answersSnapshot = await getDocs(answersQuery);
  userAnswersRefs.value = [];
  userAnswers.value = answersSnapshot.docs.map((doc) => {
    userAnswersRefs.value.push(doc.ref);
    return doc.data() as UserAnswer;
  });
};
const nextAnswer = async () => {
  currentAnswersIndex.value++;
  if (
    currentAnswersIndex.value <
    gameData.rounds[currentRoundIndex.value].questions.length - 1
  ) {
    await updateDoc(ongoingGameRef, {
      currentAnswersIndex: currentAnswersIndex.value,
    });
    currentAnswer.value =
      gameData.rounds[currentRoundIndex.value].questions[
        currentAnswersIndex.value
      ];
    await loadAnswers(currentAnswer.value);
  } else {
    showResults.value = true;
    calculateRoundResults();
  }
};
const hideResult = async () => {
  showResults.value = false;
  hideAnswers();
  await nextRound();
};
const toggleAnswerCorrect = async (index: number) => {
  userAnswers.value[index].correct = !userAnswers.value[index].correct;
  // Здесь вы можете также обновить данные в базе данных, если это необходимо
  await updateDoc(userAnswersRefs.value[index], {
    correct: userAnswers.value[index].correct,
  });
};

const nextRound = async () => {
  if (currentRoundIndex.value < gameData.rounds.length - 1) {
    currentRoundIndex.value++;
    currentQuestionIndex.value = 0;
    currentAnswersIndex.value = -1;
    showingAnswers.value = false; // Скрыть ответы перед переходом к следующему раунду
    await updateDoc(ongoingGameRef, {
      currentRoundIndex: currentRoundIndex.value,
      currentAnswersIndex: currentAnswersIndex.value,
      currentQuestionIndex: currentQuestionIndex.value,
    });
    currentRound.value = gameData.rounds[currentRoundIndex.value]; // Обновление текущего раунда
    currentQuestion.value =
      gameData.rounds[currentRoundIndex.value].questions[
        currentQuestionIndex.value
      ];
  } else {
    // конец игры
    gameEnd.value = true;
  }
};

const prevQuestion = async () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  } else if (currentRoundIndex.value > 0) {
    currentRoundIndex.value--;
    currentQuestionIndex.value =
      gameData.rounds[currentRoundIndex.value].questions.length - 1;
  }
  await updateDoc(ongoingGameRef, {
    currentRoundIndex: currentRoundIndex.value,
    currentQuestionIndex: currentQuestionIndex.value,
  });
  currentRound.value = gameData.rounds[currentRoundIndex.value]; // Обновление текущего раунда
  currentQuestion.value =
    gameData.rounds[currentRoundIndex.value].questions[
      currentQuestionIndex.value
    ];
};
const showAnswers = () => {
  showingAnswers.value = true; // Установите это значение в true, чтобы показать ответы
};

const hideAnswers = () => {
  showingAnswers.value = false; // Установите это значение в false, чтобы скрыть ответы
};

const calculateRoundResults = async () => {
  const answersQuery = query(
    userAnswersCol,
    where("roundID", "==", currentRoundIndex.value),
    where("gameID", "==", gameId)
  );
  const answersSnapshot = await getDocs(answersQuery);
  const roundAnswers = answersSnapshot.docs.map((doc) => {
    return doc.data() as UserAnswer;
  });

  roundAnswers.forEach((answer) => {
    if (!roundScores[answer.userId]) roundScores[answer.userId] = 0;
    if (answer.correct) roundScores[answer.userId] += 1;
  });

  for (const userId in roundScores) {
    let userResult = userResults.value.find(
      (result) => result.userId === userId
    );
    if (!userResult) {
      userResult = { userId, scores: {}, totalScore: 0 };
      userResults.value.push(userResult);
    }
    userResult.scores[roundName] = roundScores[userId];
    userResult.totalScore += roundScores[userId];
  }
};
</script>
