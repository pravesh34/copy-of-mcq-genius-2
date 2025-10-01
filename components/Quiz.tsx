import React, { useState } from 'react';
import { Question, UserAnswers } from '../types';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from './Icons';

interface QuizProps {
  questions: Question[];
  onFinish: (score: number, userAnswers: UserAnswers) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswerIndex(index);
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: index }));
    if (index === currentQuestion.correctAnswerIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      onFinish(score, userAnswers);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
            <p className="text-sm text-[var(--text-secondary)]">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mt-1">{currentQuestion.questionText}</h2>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-sm text-[var(--text-secondary)]">Score</p>
            <p className="text-2xl font-bold text-[var(--accent-secondary)]">{score}</p>
        </div>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-300 flex items-center justify-between text-lg ${
              !isAnswered 
                ? 'bg-[var(--bg-primary)] hover:border-[var(--accent-secondary)]'
                : index === currentQuestion.correctAnswerIndex
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : index === selectedAnswerIndex
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-[var(--bg-primary)] cursor-not-allowed opacity-60'
            }`}
          >
            <span>{option}</span>
            {isAnswered && index === currentQuestion.correctAnswerIndex && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
            {isAnswered && index === selectedAnswerIndex && index !== currentQuestion.correctAnswerIndex && <XCircleIcon className="w-6 h-6 text-red-400" />}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <SparklesIcon className="w-5 h-5 text-[var(--accent-secondary)]" />
            <h3 className="text-lg font-semibold text-[var(--accent-secondary)]">Explanation</h3>
          </div>
          <p className="text-[var(--text-secondary)]">{currentQuestion.reason}</p>
        </div>
      )}
      {isAnswered && (
        <div className="mt-8 text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-opacity text-lg animate-fade-in"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
