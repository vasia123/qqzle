<template>
  <TitleCard title="Управление вопросами раунда">
    <div v-if="questions.length > 0">
      <div class="overflow-x-auto w-full">
        <div
          v-for="(question, index) in questions"
          :key="question.ID"
          class="my-2 p-2"
        >
          <div class="mb-1">{{ question.text }}</div>
          <button
            class="btn btn-primary mr-2"
            @click="showAddOrEditQuestionModal(index)"
          >
            Редактировать
          </button>
          <button
            class="btn btn-error mr-2"
            @click="showDeleteConfirmation(index)"
          >
            Удалить
          </button>
          <button
            class="btn btn-secondary mr-2"
            :disabled="index === 0"
            @click="moveQuestionUp(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
              />
            </svg>
          </button>
          <button
            class="btn btn-secondary"
            :disabled="index === questions.length - 1"
            @click="moveQuestionDown(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-down"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else>пока пусто</div>
    <div class="flex justify-between mt-8">
      <NuxtLink class="btn btn-ghost" :to="'/admin/games/' + gameId + '/rounds'"
        >Вернуться</NuxtLink
      >
      <button class="btn btn-primary" @click="showAddOrEditQuestionModal(null)">
        Добавить вопрос
      </button>
    </div>
  </TitleCard>

  <ModalDialog modal-id="add-question-modal" :show-modal="showAddQuestionModal">
    <template #title>
      <h3 class="font-bold text-lg">Добавление вопроса</h3>
    </template>
    <template #content>
      <div class="grid grid-cols-1 gap-6">
        <FormInputTextarea
          v-model="newQuestion.text"
          label-title="Текст вопроса"
        ></FormInputTextarea>
        <div v-if="uploadProgress > 0 && uploadProgress < 100">
          Загрузка: {{ uploadProgress }}%
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-base-content"> Тип вопроса </span>
          </label>
          <select
            v-model="newQuestion.questionType"
            class="select select-bordered"
          >
            <option value="text">Текст</option>
            <option value="img_text">Изображение + Текст</option>
            <!-- <option value="video_text">Видео + Текст</option> -->
          </select>
        </div>
        <FormInputFile
          v-if="newQuestion.questionType === 'img_text'"
          label-title="Изображение вопроса"
          @file-selected="handleImageFileSelected"
        />
        <div v-if="imagePreviewUrl">
          <img :src="imagePreviewUrl" alt="Превью изображения" />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-base-content"> Тип ответа </span>
          </label>
          <select
            v-model="newQuestion.guessType"
            class="select select-bordered"
          >
            <option value="text">Текст</option>
            <option value="options">Варианты</option>
            <option value="number">Число</option>
          </select>
        </div>
        <div v-if="newQuestion.guessType === 'options'">
          <div
            v-for="(option, index) in newQuestion.guessOptions"
            :key="index"
            class="option-container"
          >
            <input
              v-model="newQuestion.guessOptions[index]"
              type="text"
              placeholder="Вариант ответа"
              class="input input-bordered"
            />
            <button class="btn btn-error" @click="removeOption(index)">
              Удалить
            </button>
          </div>
          <button class="btn btn-primary mt-2" @click="addOption">
            Добавить вариант
          </button>
        </div>
        <FormInputText
          v-model="newQuestion.answer"
          label-title="Ответ"
        ></FormInputText>
        <FormInputFile
          label-title="Звук вопроса"
          @file-selected="handleSoundFileSelected"
        />
        <div v-if="soundPreviewUrl">
          <audio :src="soundPreviewUrl" controls></audio>
        </div>
        <!-- TODO: Добавить здесь поле для видео -->
      </div>
    </template>
    <template #actions>
      <label class="btn" @click="showAddQuestionModal = false">Отмена</label>
      <button class="btn btn-primary" @click="addOrUpdateQuestion">
        Сохранить
      </button>
    </template>
  </ModalDialog>
  <ModalDialog modal-id="delete-modal" :show-modal="showDeleteModal">
    <template #title>
      <h3 class="font-bold text-lg">Подтверждение удаления</h3>
    </template>
    <template #content>
      <p class="py-4">Вы уверены, что хотите удалить этот вопрос?</p>
    </template>
    <template #actions>
      <label class="btn" @click="showDeleteModal = false">Отмена</label>
      <button class="btn btn-error" @click="deleteQuestion">Удалить</button>
    </template>
  </ModalDialog>
  <ModalError :message="errorMessage" />
  <ModalIndicator modal-id="loading-modal" :show-modal="loading">
    <template #content>
      <p class="py-4">
        <span class="loading loading-spinner"></span> Идёт загрузка...
      </p>
    </template>
  </ModalIndicator>
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { Game, Question } from "~/types/db";

const { gamesAndQuestionsCol } = useFirebaseDB();
const { uploadFile, resizeImage } = useUploadImage();
const route = useRoute();
let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;
let roundIndex: number;
if (Array.isArray(route.params.roundId))
  roundIndex = parseInt(route.params.roundId.join(""));
else roundIndex = parseInt(route.params.roundId);
const questions = ref<Question[]>([]); // Здесь можно загрузить вопросы для данного раунда
const showDeleteModal = ref(false);
const loading = ref(false);
let questionToDelete: number | null = null;
const imageFile = ref<File | null>(null);
const imageFileUrl = ref("");
const soundFileUrl = ref("");
const soundFile = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);
const uploadProgress = ref(0);
const errorMessage = ref("");
const soundPreviewUrl = ref<string | null>(null);
const editingQuestionIndex = ref<number | null>(null);

const showAddQuestionModal = ref(false);
const newQuestion = ref<Question>({
  ID: "",
  sortOrder: 0,
  questionType: "text",
  text: "",
  guessType: "text",
  image: "",
  sound: "",
  answer: "",
  guessOptions: [],
});

const showAddOrEditQuestionModal = (questionIndex: number | null = null) => {
  console.log("questionIndex", questionIndex);
  if (questionIndex !== null) {
    newQuestion.value = { ...questions.value[questionIndex] }; // Клонирование вопроса
    editingQuestionIndex.value = questionIndex;
  } else {
    // Сбросить форму для нового вопроса
    newQuestion.value = {
      ID: "",
      sortOrder: 0,
      questionType: "text",
      text: "",
      image: "",
      sound: "",
      guessType: "text",
      answer: "",
      guessOptions: [],
    };
    editingQuestionIndex.value = null;
  }
  imageFileUrl.value = newQuestion.value.image || "";
  soundFileUrl.value = newQuestion.value.sound || "";
  imagePreviewUrl.value = newQuestion.value.image || "";
  soundPreviewUrl.value = newQuestion.value.sound || "";
  showAddQuestionModal.value = true;
};

const addOption = () => {
  newQuestion.value.guessOptions.push("");
};

const handleImageFileSelected = (file: File) => {
  loading.value = true;
  imageFile.value = file;
  resizeImage(file, (resizedBlob) => {
    const url = URL.createObjectURL(resizedBlob);
    imagePreviewUrl.value = url;
    loading.value = false;
  });
};
const handleSoundFileSelected = (file: File) => {
  soundFile.value = file;

  // Create a URL from the sound file to use as the src for an audio element
  const url = URL.createObjectURL(file);
  soundPreviewUrl.value = url;
};

const saveQuestion = async () => {
  // Находим нужный тур по ID
  const round = gameData.rounds.find((_r, index) => index === roundIndex);
  if (!round) {
    errorMessage.value = "Тур не найден";
    return;
  }
  console.log("imageFileUrl.value2", imageFileUrl.value);
  newQuestion.value.image = imageFileUrl.value;
  newQuestion.value.sound = soundFileUrl.value;
  // questions.value = gameData.rounds[roundIndex].questions;
  if (editingQuestionIndex.value !== null) {
    // Обновить существующий вопрос
    questions.value[editingQuestionIndex.value] = newQuestion.value;
  } else {
    // Добавить новый вопрос
    newQuestion.value.ID = uuid();
    newQuestion.value.sortOrder = round.questions.length;
    questions.value.push(newQuestion.value);
  }
  gameData.rounds[roundIndex].questions = questions.value;

  await updateDoc(gameRef, { rounds: gameData.rounds });
};

const uploadFileWithPromise = (
  file: File,
  path = "images"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadFile(file, path);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        uploadProgress.value =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error("Ошибка загрузки:", error);
        reject(error.message);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

const addOrUpdateQuestion = async () => {
  // Проверка и валидация данных вопроса
  if (newQuestion.value.text.trim() === "") {
    errorMessage.value = "Введите текст вопроса";
    return;
  }
  loading.value = true;
  try {
    // Загрузка изображения, если оно выбрано
    if (imageFile.value) {
      imageFileUrl.value = await uploadFileWithPromise(imageFile.value);
      imageFile.value = null;
    }
    if (soundFile.value) {
      soundFileUrl.value = await uploadFileWithPromise(
        soundFile.value,
        "sounds"
      );
      soundFile.value = null;
    }
    await saveQuestion();
    showAddQuestionModal.value = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      console.error("Unexpected error", error);
    }
  }
};
const removeOption = (index: number) => {
  newQuestion.value.guessOptions.splice(index, 1);
};
const moveQuestionUp = async (index: number) => {
  if (index > 0) {
    const temp = questions.value[index - 1];
    questions.value[index - 1] = questions.value[index];
    questions.value[index] = temp;

    loading.value = true;
    gameData.rounds[roundIndex].questions = questions.value;
    await updateDoc(gameRef, { rounds: gameData.rounds });
    loading.value = false;
  }
};

const moveQuestionDown = async (index: number) => {
  if (index < questions.value.length - 1) {
    const temp = questions.value[index + 1];
    questions.value[index + 1] = questions.value[index];
    questions.value[index] = temp;

    loading.value = true;
    gameData.rounds[roundIndex].questions = questions.value;
    await updateDoc(gameRef, { rounds: gameData.rounds });
    loading.value = false;
  }
};

// Загрузка вопросов раунда
const gameRef = doc(gamesAndQuestionsCol, gameId);
const gameDoc = await getDoc(gameRef);
if (!gameDoc.exists()) {
  throw showError({
    statusCode: 404,
    statusMessage: "Игра не найдена",
  });
}
const gameData = gameDoc.data() as Game;
const round = gameData.rounds[roundIndex];
if (round) {
  questions.value = round.questions;
} else {
  throw showError({
    statusCode: 404,
    statusMessage: "Раунд не найден",
  });
}

const showDeleteConfirmation = (questionId: number) => {
  questionToDelete = questionId;
  showDeleteModal.value = true;
};

const deleteQuestion = async () => {
  if (questionToDelete && questionToDelete > -1) {
    // Find the index of the question to delete

    // Remove the question from the array
    questions.value.splice(questionToDelete, 1);
    gameData.rounds[roundIndex].questions = questions.value;
    await updateDoc(gameRef, { rounds: gameData.rounds });

    // Reset the questionToDelete variable
    questionToDelete = null;

    // Close the delete confirmation modal
    showDeleteModal.value = false;
  }
};
</script>
