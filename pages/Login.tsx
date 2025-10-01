import React, { useState } from 'react';
import { LogoIcon } from '../components/Icons';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
             <header className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <LogoIcon className="h-10 w-10 text-[var(--accent-primary)]" />
                    <h1 className="text-4xl font-extrabold tracking-tight" style={{
                        background: 'linear-gradient(to right, var(--accent-secondary), var(--accent-primary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                    MCQ Genius
                    </h1>
                </div>
                <p className="text-[var(--text-secondary)]">The smartest way to practice for your exams.</p>
            </header>
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold text-center text-[var(--text-primary)] mb-6">Welcome Back!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Enter your name to continue
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--text-secondary)]/30 focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-all"
                            placeholder="e.g., Alex"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-opacity"
                    >
                        Login & Start Learning
                    </button>
                </form>
            </div>
            <footer className="text-center mt-8 text-[var(--text-secondary)]/70 text-sm">
                <p>Powered by Gemini AI</p>
            </footer>
        </div>
    );
};

export default LoginPage;
