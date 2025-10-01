import React from 'react';
import { QuizResult } from '../types';
import { SparklesIcon } from '../components/Icons';

interface DashboardProps {
    user: string;
    quizHistory: QuizResult[];
    onStartNewQuiz: () => void;
    onReview: (result: QuizResult) => void;
}

const QuizHistoryCard: React.FC<{ result: QuizResult; onReview: () => void; }> = ({ result, onReview }) => {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const scoreColor = percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="bg-[var(--bg-primary)] p-4 rounded-lg flex items-center justify-between hover:bg-opacity-80 transition-colors">
            <div>
                <p className="text-sm text-[var(--text-secondary)]">{result.date}</p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">Quiz Result</p>
            </div>
            <div className="flex items-center gap-4">
                <p className={`text-xl font-bold ${scoreColor}`}>{result.score}/{result.totalQuestions} ({percentage}%)</p>
                <button
                    onClick={onReview}
                    className="bg-[var(--accent-primary)] text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Review
                </button>
            </div>
        </div>
    )
}


const Dashboard: React.FC<DashboardProps> = ({ user, onStartNewQuiz, quizHistory, onReview }) => {
    return (
        <div className="space-y-8">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user}!</h2>
                <p className="text-lg text-[var(--text-secondary)] mb-6">Ready to ace your next test? Let's get started.</p>
                <button
                    onClick={onStartNewQuiz}
                    className="bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-opacity text-lg inline-flex items-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Create a New Quiz
                </button>
            </div>

            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Your Quiz History</h3>
                {quizHistory.length > 0 ? (
                    <div className="space-y-4">
                        {quizHistory.map(result => (
                            <QuizHistoryCard key={result.id} result={result} onReview={() => onReview(result)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[var(--text-secondary)]/30 rounded-lg">
                        <p className="text-[var(--text-secondary)]">You haven't taken any quizzes yet.</p>
                        <p className="text-sm text-[var(--text-secondary)]/70">Your past results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
