<template>
  <div class="bg-image z-0 inset-0 absolute"></div>
  <section class="relative z-10">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 text-white logo-text"
      >
        <img class="w-8 h-8 mr-2" src="/images/logo_500.png" alt="logo" />
        Easy Квизи
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <!-- <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center"
          >
            Вход
          </h1> -->
          <div class="grid space-y-4">
            <!-- <div class="field">
              <input
                v-model="userName"
                placeholder="Введите своё имя"
                name="name"
                required="true"
                class="input input-bordered input-primary w-full"
              />
            </div> -->
            <button
              class="btn btn-active btn-primary"
              :disabled="loading"
              @click="login"
            >
              <svg
                v-if="!loading"
                id="google"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                class="mr-2"
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span v-else class="loading loading-spinner"></span>
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <ModalError :message="errorMessage" />
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { registerUser } = useFirebaseAuth();

definePageMeta({
  middleware: ["notauth"],
});

const authStore = useAuthStore();
// const userName = ref("");
const loading = ref(false);
const errorMessage = ref("");

// async function login() {
//   if (userName.value === "") {
//     errorMessage.value = "введите имя";
//     return;
//   }
//   loading.value = true;
//   const error = await authStore.logIn(userName.value);
//   console.log("result", error);
//   if (error) {
//     errorMessage.value = error.message;
//   }
//   loading.value = false;
// }

async function login() {
  loading.value = true;
  const result = await registerUser();
  if (!result) {
    errorMessage.value = "не получилось аутентифицировать пользователя!";
  } else {
    authStore.setUser(result);
    navigateTo("/");
  }
  //   loading.value = false;
}
</script>

<style scoped>
.bg-image {
  background-image: url("/images/logo_500.png");
  filter: blur(8px);
  -webkit-filter: blur(8px);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.logo-text {
  text-shadow: 1px 1px 2px #000, 0 0 1em #000;
}
</style>
