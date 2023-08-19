// Результаты игр
export interface GameResult {
  gameID: string;
  userID: string;
  score: number;
  date: Date;
}

// Вопросы
export interface Question {
  ID: string;
  sortOrder: number;
  questionType: "text" | "img_text" | "video_text";
  text: string;
  image: string;
  sound: string;
  guessType: "text" | "options" | "number";
  guessOptions: string[];
  answer: string;
}

export interface Round {
  name: string;
  description: string;
  image: string; 
  questions: Question[]; 
}


// Добавленные игры и вопросы к ним
export interface Game {
  userID: string;
  name: string;
  description: string;
  rounds: Round[];
}

// Проходящие в данный момент игры
export interface OngoingGame {
  code: string;
  gameID: string;
  status: string;
  currentRoundIndex: number;
  currentQuestionIndex: number;
  currentAnswersIndex: number;
}

// Ответы пользователей на вопросы
export interface UserAnswer {
  userID: string; // ID пользователя, который дал ответ
  userName: string; // Name пользователя, который дал ответ
  gameID: string; // ID игры, к которой относится вопрос
  roundID: number; // ID раунда, к которому относится вопрос
  questionID: string; // ID вопроса, на который был дан ответ
  answer: string; // Ответ пользователя (может быть текстом, числом или индексом выбранного варианта)
  timestamp: Date; // Время, когда был дан ответ
  correct: boolean; // Время, когда был дан ответ
}
