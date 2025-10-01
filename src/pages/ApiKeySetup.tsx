import React, { useState } from 'react';
import { SparklesIcon } from '../components/Icons';

interface ApiKeySetupPageProps {
    onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetupPage: React.FC<ApiKeySetupPageProps> = ({ onApiKeySet }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySet(apiKey.trim());
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl">
            <div className="text-center mb-6">
                <SparklesIcon className="h-10 w-10 text-[var(--accent-primary)] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Set up your API Key</h2>
                <p className="text-[var(--text-secondary)] mt-2">
                    To use MCQ Genius, you need a Google Gemini API key. Your key is stored securely in your browser's local storage and is never sent to any server but Google's.
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Google Gemini API Key
                    </label>
                    <input
                        type="password"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--text-secondary)]/30 focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none transition-all"
                        placeholder="Enter your API key"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-opacity"
                >
                    Save & Continue
                </button>
            </form>
             <div className="text-center mt-6 text-sm">
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--accent-secondary)] hover:underline"
                >
                    Get your API key from Google AI Studio
                </a>
            </div>
        </div>
    );
};

export default ApiKeySetupPage;
