import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { GameResult, Game, OngoingGame, UserAnswer } from "types/db";

export default function () {
  const createCollection = <T = DocumentData>(collectionName: string) => {
    const { $firestore } = useNuxtApp();
    return collection($firestore, collectionName) as CollectionReference<T>;
  };

  const gameResultsCol = createCollection<GameResult>("gameResults");
  const gamesAndQuestionsCol = createCollection<Game>("gamesAndQuestions");
  const ongoingGamesCol = createCollection<OngoingGame>("ongoingGames");
  const userAnswersCol = createCollection<UserAnswer>("userAnswers");
  return {
    createCollection,
    gameResultsCol,
    gamesAndQuestionsCol,
    ongoingGamesCol,
    userAnswersCol,
  };
}
