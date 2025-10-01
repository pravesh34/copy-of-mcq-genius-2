export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  reason: string;
}

export type UserAnswers = {
  [questionIndex: number]: number; // Maps question index to the selected option index
};

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  date: string;
  questions: Question[];
  userAnswers: UserAnswers;
}
