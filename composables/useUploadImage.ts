import { UploadTask, ref, uploadBytesResumable } from "firebase/storage";

export default function () {
  const uploadFile = (file: File, dir = "images"): UploadTask => {
    const { $firestorage } = useNuxtApp();
    // Создайте ссылку на файл в хранилище
    const storageRef = ref($firestorage, dir + "/" + file.name);

    // Создайте задачу для загрузки файла
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Отслеживайте изменение состояния, такие как progress, pause и resume
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Загрузка: " + progress + "% выполнено");
    //   },
    //   (error) => {
    //     console.error("Ошибка загрузки:", error);
    //   },
    //   () => {
    //     // Получите URL загруженного файла
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       console.log("Файл доступен по следующему URL:", downloadURL);
    //       // Теперь вы можете использовать downloadURL для добавления изображения к туру
    //     });
    //   }
    // );
    return uploadTask;
  };
  const resizeImage = function (
    file: File,
    callback: (blob: Blob) => void
  ): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Проверка, является ли ширина или высота больше 1200 пикселей
        if (width > 1200 || height > 1200) {
          const maxDimension = 1200;

          if (width > height) {
            height *= maxDimension / width;
            width = maxDimension;
          } else {
            width *= maxDimension / height;
            height = maxDimension;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  callback(blob);
                }
              },
              "image/jpeg",
              0.7
            );
          }
        } else {
          // Если изображение уже меньше 1200 пикселей, просто вызовите callback с оригинальным файлом
          file.arrayBuffer().then((buffer) => {
            callback(new Blob([buffer], { type: file.type }));
          });
        }
      };
      if (typeof event.target?.result === "string") {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };
  return {
    uploadFile,
    resizeImage,
  };
}
