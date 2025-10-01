import React, { useState } from 'react';
import { LogoIcon, UserIcon, LogoutIcon, ThemeIcon, SettingsIcon } from './Icons';

interface HeaderProps {
    user: string;
    onLogout: () => void;
    theme: string;
    setTheme: (theme: string) => void;
    onNavigateToDashboard: () => void;
    onEditApiKey: () => void;
}

const themes = [
    { name: 'dark', label: 'Dark' },
    { name: 'light', label: 'Light' },
    { name: 'emerald', label: 'Emerald' },
    { name: 'rose', label: 'Rose' },
];

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, setTheme, onNavigateToDashboard, onEditApiKey }) => {
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);

    return (
        <header className="flex items-center justify-between bg-[var(--bg-secondary)] p-4 rounded-xl shadow-lg">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={onNavigateToDashboard}
            >
                <LogoIcon className="h-8 w-8 text-[var(--accent-primary)]" />
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] hidden sm:block">
                    MCQ Genius
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <UserIcon className="h-5 w-5" />
                    <span className="font-semibold">{user}</span>
                </div>
                
                <div className="relative">
                    <button onClick={() => setThemeMenuOpen(!themeMenuOpen)} className="p-2 rounded-full hover:bg-[var(--bg-primary)] transition-colors">
                        <ThemeIcon className="h-6 w-6 text-[var(--text-secondary)]"/>
                    </button>
                    {themeMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-[var(--bg-primary)] border border-[var(--text-secondary)]/20 rounded-lg shadow-xl z-10">
                            {themes.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => {
                                        setTheme(t.name);
                                        setThemeMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm ${theme === t.name ? 'font-bold text-[var(--accent-secondary)]' : 'text-[var(--text-primary)]'} hover:bg-[var(--bg-secondary)]`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                 <button onClick={onEditApiKey} title="API Key Settings" className="p-2 rounded-full hover:bg-[var(--bg-primary)] transition-colors">
                    <SettingsIcon className="h-6 w-6 text-[var(--text-secondary)]" />
                </button>

                <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-[var(--bg-primary)] transition-colors">
                    <LogoutIcon className="h-6 w-6 text-red-400" />
                </button>
            </div>
        </header>
    );
};

export default Header;
