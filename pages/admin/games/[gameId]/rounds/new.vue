<template>
  <TitleCard title="Добавление тура">
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
      <button class="btn btn-primary" :disabled="loading" @click="addRound">
        <span v-if="loading" class="loading loading-spinner"></span>
        Добавить тур
      </button>
    </div>
  </TitleCard>
  <ModalError :message="errorMessage" />
</template>

<script setup lang="ts">
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { Game, Round } from "types/db";

const route = useRoute();
const { gamesAndQuestionsCol } = useFirebaseDB();
const { uploadFile, resizeImage } = useUploadImage();
let gameId: string;
if (Array.isArray(route.params.gameId)) gameId = route.params.gameId.join("");
else gameId = route.params.gameId;
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
// Функция для добавления тура
const saveRound = async (imageUrl: string) => {
  // Получение текущих данных игры
  const gameRef = doc(gamesAndQuestionsCol, gameId);
  const gameDoc = await getDoc(gameRef);
  if (gameDoc.exists()) {
    const gameData = gameDoc.data() as Game;

    // Создание нового тура
    const newRound: Round = {
      name: roundName.value,
      image: imageUrl,
      description: roundDescription.value,
      questions: [], // Пустой массив вопросов
    };

    // Добавление тура к текущим турам
    const updatedRounds = [...gameData.rounds, newRound];
    await updateDoc(gameRef, { rounds: updatedRounds });
    navigateTo("/admin/games/" + gameId + "/rounds");
  } else {
    loading.value = false;
    errorMessage.value = "Игра не найдена";
  }
};
const addRound = () => {
  loading.value = true;
  try {
    // Загрузка изображения, если оно выбрано
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
          errorMessage.value = error.message;
        },
        async () => {
          // Получите URL загруженного файла
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await saveRound(imageUrl);
        }
      );
    } else {
      saveRound("");
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
