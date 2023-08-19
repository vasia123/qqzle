import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useAuthStore();

  if (user.userId !== "") {
    return navigateTo("/");
  }
});
