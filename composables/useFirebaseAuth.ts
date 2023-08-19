import { signInWithPopup, User, GoogleAuthProvider } from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  const registerUser = async (): Promise<User | null> => {
    try {
      // Sign in using a redirect.
      const provider = new GoogleAuthProvider();
      // Start a sign in process for an unauthenticated user.
      provider.addScope("profile");
      provider.addScope("email");
      const result = await signInWithPopup($auth, provider);
      if (result) {
        // This gives you a Google Access Token.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // console.log("result.user", result.user);
        return result.user;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return null;
    }
    return null;
  };

  return {
    registerUser,
  };
}
