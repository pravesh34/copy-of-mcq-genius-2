import React, { useState } from 'react';
import { QuizResult } from '../types';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';

interface QuizReviewProps {
  result: QuizResult;
  onBackToDashboard: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ result, onBackToDashboard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { questions, userAnswers } = result;
  const currentQuestion = questions[currentIndex];
  const userAnswerIndex = userAnswers[currentIndex];
  
  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < questions.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Reviewing Your Quiz</h2>
      
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
            <p className="text-sm text-[var(--text-secondary)]">Question {currentIndex + 1} of {questions.length}</p>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mt-1">{currentQuestion.questionText}</h3>
        </div>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswerIndex;
          const isUserAnswer = index === userAnswerIndex;
          
          let style = 'bg-[var(--bg-primary)]';
          if (isCorrect) {
            style = 'bg-green-500/20 border-green-500 text-green-300';
          } else if (isUserAnswer) {
            style = 'bg-red-500/20 border-red-500 text-red-300';
          }

          return (
            <div
              key={index}
              className={`w-full text-left p-4 rounded-lg border-2 border-transparent flex items-center justify-between text-lg ${style}`}
            >
              <span>{option}</span>
              {isCorrect && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
              {isUserAnswer && !isCorrect && <XCircleIcon className="w-6 h-6 text-red-400" />}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-[var(--bg-primary)] rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-5 h-5 text-[var(--accent-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--accent-secondary)]">Explanation</h3>
        </div>
        <p className="text-[var(--text-secondary)]">{currentQuestion.reason}</p>
      </div>

      <div className="mt-8 flex items-center justify-between">
         <button
          onClick={onBackToDashboard}
          className="bg-[var(--bg-primary)] hover:border-[var(--accent-secondary)] border-2 border-transparent text-[var(--text-primary)] font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 rounded-full bg-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <span className="font-semibold">{currentIndex + 1} / {questions.length}</span>
            <button onClick={handleNext} disabled={currentIndex === questions.length - 1} className="p-2 rounded-full bg-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
