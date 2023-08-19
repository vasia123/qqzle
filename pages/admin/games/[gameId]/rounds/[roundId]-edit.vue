<template>
  <TitleCard title="Редактирование тура">
    <FormInputText
      v-model="roundName"
      type="text"
      label-title="Название тура"
    />
    <FormInputFile
      label-title="Изображение тура"
      @file-selected="handleFileSelected"
    />
    <div v-if="imagePreviewUrl">
      <img :src="imagePreviewUrl" alt="Превью изображения" />
    </div>
    <div v-if="uploadProgress > 0 && uploadProgress < 100">
      Загрузка: {{ uploadProgress }}%
    </div>
    <FormInputTextarea
      v-model="roundDescription"
      label-title="Описание"
    ></FormInputTextarea>
    <div class="flex justify-between mt-8">
      <NuxtLink class="btn btn-ghost" :to="'/admin/games/' + gameId + '/rounds'"
        >Отмена</NuxtLink
      >
      <button class="btn btn-primary" :disabled="loading" @click="updateRound">
        <span v-if="loading" class="loading loading-spinner"></span>
        Сохранить изменения
      </button>
    </div>
  </TitleCard>
  <ModalError :message="errorMessage" />
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { Game } from "types/db";

const route = useRoute();
const { gamesAndQuestionsCol } = useFirebaseDB();
const { uploadFile, resizeImage } = useUploadImage();
let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;
let roundId: string;
if (Array.isArray(route.params.roundId))
  roundId = route.params.roundId.join("");
else roundId = route.params.roundId;
const errorMessage = ref("");
const roundName = ref("");
const roundDescription = ref("");
const loading = ref(false);
const imageFile = ref<File | null>(null);

const imagePreviewUrl = ref<string | null>(null);
const uploadProgress = ref(0);

// Обработчик выбора файла
const handleFileSelected = (file: File) => {
  loading.value = true;
  imageFile.value = file;
  resizeImage(file, (resizedBlob) => {
    const url = URL.createObjectURL(resizedBlob);
    imagePreviewUrl.value = url;
    loading.value = false;
  });
};
// Загрузка данных тура при инициализации компонента
const loadRoundData = async () => {
  const gameRef = doc(gamesAndQuestionsCol, gameId);
  const gameDoc = await getDoc(gameRef);
  if (gameDoc.exists()) {
    const gameData = gameDoc.data() as Game;
    const round = gameData.rounds.find(
      (_r, index) => index.toString() === roundId
    );
    if (round) {
      roundName.value = round.name;
      roundDescription.value = round.description;
      imagePreviewUrl.value = round.image; // Если у вас есть URL изображения
    } else {
      errorMessage.value = "Тур не найден";
    }
  } else {
    errorMessage.value = "Игра не найдена";
  }
};

// Вызовите эту функцию при инициализации компонента
loadRoundData();
// Функция для добавления тура
const updateRound = async () => {
  loading.value = true;
  try {
    const gameRef = doc(gamesAndQuestionsCol, gameId);
    const gameDoc = await getDoc(gameRef);
    if (gameDoc.exists()) {
      const gameData = gameDoc.data() as Game;
      let imageUrl = imagePreviewUrl.value; // Используйте существующий URL изображения

      // Если изображение было изменено, загрузите новый файл
      if (imageFile.value) {
        const uploadTask = uploadFile(imageFile.value);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            uploadProgress.value =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error("Ошибка загрузки:", error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          }
        );
      }

      // Найдите и обновите тур
      const updatedRounds = gameData.rounds.map((r, index) =>
        index.toString() === roundId
          ? {
              ...r,
              name: roundName.value,
              description: roundDescription.value,
              image: imageUrl,
            }
          : r
      );

      await updateDoc(gameRef, { rounds: updatedRounds });
      await navigateTo("/admin/games/" + gameId + "/rounds");
    } else {
      errorMessage.value = "Игра не найдена";
    }
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
