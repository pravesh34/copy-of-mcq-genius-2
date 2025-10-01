import React from 'react';
import { QuizResult } from '../types';

interface QuizResultPageProps {
  result: QuizResult;
  onReview: () => void;
  onNewQuiz: () => void;
}

const QuizResultPage: React.FC<QuizResultPageProps> = ({ result, onReview, onNewQuiz }) => {
  const { score, totalQuestions, date } = result;
  const percentage = Math.round((score / totalQuestions) * 100);
  const scoreColor = percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-green-400 mb-2">Quiz Complete!</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-4">Completed on: {date}</p>
      
      <div className="my-8">
        <p className="text-lg text-[var(--text-secondary)]">Your Score</p>
        <p className={`text-6xl font-extrabold ${scoreColor}`}>{percentage}%</p>
        <p className="text-xl text-[var(--text-primary)] font-semibold mt-2">
          {score} out of {totalQuestions} correct
        </p>
      </div>

      <p className="text-[var(--text-secondary)] mb-8">Great job! Review your answers or start a new quiz.</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onNewQuiz}
          className="bg-[var(--bg-primary)] hover:border-[var(--accent-secondary)] border-2 border-transparent text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg transition-colors text-lg"
        >
          New Quiz
        </button>
        <button
          onClick={onReview}
          className="bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-opacity text-lg"
        >
          Review Answers
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;
