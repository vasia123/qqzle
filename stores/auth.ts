import { User } from "firebase/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const userId = useLocalStorage("pinia/auth/user_id", "");
  const userName = useLocalStorage("pinia/auth/user_name", "anonimous");
  function setUser(user: User) {
    userId.value = user.uid;
    userName.value = user.displayName;
  }
  function logOut() {
    userId.value = "";
    userName.value = "anonimous";
  }

  return { userId, userName, setUser, logOut };
});
