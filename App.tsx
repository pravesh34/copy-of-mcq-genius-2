import React, { useState, useCallback, useEffect } from 'react';
import { Question, QuizResult, UserAnswers } from './types';
import { generateMcqFromImage, generateMcqFromText } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

import LoginPage from './pages/Login';
import ApiKeySetupPage from './pages/ApiKeySetup';
import Dashboard from './pages/Dashboard';
import QuizResultPage from './pages/QuizResult';
import QuizReview from './pages/QuizReview';
import ProcessingPage from './pages/ProcessingPage';

import FileUpload from './components/FileUpload';
import Quiz from './components/Quiz';
import Loader from './components/Loader';
import Header from './components/Header';

type View = 'LOGIN' | 'API_KEY_SETUP' | 'DASHBOARD' | 'UPLOAD' | 'PROCESSING' | 'GENERATING' | 'QUIZ' | 'RESULTS' | 'REVIEW' | 'ERROR';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LOGIN');
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useLocalStorage<string | null>('mcq_genius_user', null);
  const [apiKey, setApiKey] = useLocalStorage<string | null>('mcq_genius_apiKey', null);
  const [quizHistory, setQuizHistory] = useLocalStorage<QuizResult[]>('mcq_genius_history', []);
  const [theme, setTheme] = useLocalStorage<string>('mcq_genius_theme', 'dark');
  
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });
  const [activeQuiz, setActiveQuiz] = useState<Question[] | null>(null);
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setView('LOGIN');
    } else if (!apiKey) {
      setView('API_KEY_SETUP');
    } else {
      setView('DASHBOARD');
    }
  }, [user, apiKey]);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveQuiz(null);
    setActiveResult(null);
  };

  const handleEditApiKey = () => {
    setApiKey(null);
  }

  const handleProcessingStart = () => {
    setProcessingProgress({ current: 0, total: 0 });
    setView('PROCESSING');
  }

  const handleProgressUpdate = (progress: { current: number; total: number }) => {
    setProcessingProgress(progress);
  };

  const handleFileProcessed = useCallback(async (processedData: { type: 'text'; data: string } | { type: 'images'; data: string[]; mimeType: string }) => {
    if (!apiKey) {
      setError("API Key is not set. Please set it in the settings.");
      setView('ERROR');
      return;
    }

    setView('GENERATING');
    setError(null);
    try {
      let questions: Question[] | null = null;
      if (processedData.type === 'images') {
        const CHUNK_SIZE = 4;
        const allImages = processedData.data;
        const chunks = [];
        for (let i = 0; i < allImages.length; i += CHUNK_SIZE) {
            chunks.push(allImages.slice(i, i + CHUNK_SIZE));
        }

        setProcessingProgress({ current: 0, total: chunks.length });
        
        let combinedQuestions: Question[] = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const questionsFromChunk = await generateMcqFromImage(chunk, processedData.mimeType, apiKey);
            if (questionsFromChunk) {
                combinedQuestions = [...combinedQuestions, ...questionsFromChunk];
            }
            setProcessingProgress({ current: i + 1, total: chunks.length });
        }
        questions = combinedQuestions;

      } else if (processedData.type === 'text') {
        setProcessingProgress({ current: 0, total: 0 }); 
        questions = await generateMcqFromText(processedData.data, apiKey);
      } else {
        throw new Error("Invalid file data received.");
      }
      
      if (questions && questions.length > 0) {
        setActiveQuiz(questions);
        setView('QUIZ');
      } else {
        throw new Error("The AI couldn't generate a quiz from the document. It might be low quality, image-based, or not contain clear questions.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setView('ERROR');
    }
  }, [apiKey]);

  const handleQuizFinish = (score: number, userAnswers: UserAnswers) => {
    if (!activeQuiz) return;
    const newResult: QuizResult = {
      id: new Date().toISOString(),
      score,
      totalQuestions: activeQuiz.length,
      date: new Date().toLocaleDateString(),
      questions: activeQuiz,
      userAnswers,
    };
    setQuizHistory([newResult, ...quizHistory]);
    setActiveResult(newResult);
    setActiveQuiz(null);
    setView('RESULTS');
  };

  const handleReviewQuiz = (result: QuizResult) => {
    setActiveResult(result);
    setView('REVIEW');
  }

  const handleStartNewQuiz = () => {
    setActiveQuiz(null);
    setActiveResult(null);
    setView('UPLOAD');
  };

  const renderContent = () => {
    switch (view) {
      case 'LOGIN':
        return <LoginPage onLogin={handleLogin} />;
      case 'API_KEY_SETUP':
        return <ApiKeySetupPage onApiKeySet={setApiKey} />;
      case 'DASHBOARD':
        return <Dashboard user={user!} onStartNewQuiz={handleStartNewQuiz} quizHistory={quizHistory} onReview={handleReviewQuiz} />;
      case 'UPLOAD':
        return <FileUpload onFileProcessed={handleFileProcessed} onProcessingStart={handleProcessingStart} onProgressUpdate={handleProgressUpdate} />;
      case 'PROCESSING':
        return <ProcessingPage progress={processingProgress} />;
      case 'GENERATING':
        return processingProgress.total > 0 ? (
            <ProcessingPage 
                progress={processingProgress} 
                title="Generating Quiz with AI..."
                subtitle="Analyzing document chunks to build your questions."
                progressLabel="Analyzing chunk"
            />
        ) : (
            <Loader message="Analyzing your document and building the quiz..." />
        );
      case 'QUIZ':
        return activeQuiz && <Quiz questions={activeQuiz} onFinish={handleQuizFinish} />;
      case 'RESULTS':
        return activeResult && <QuizResultPage result={activeResult} onReview={() => handleReviewQuiz(activeResult)} onNewQuiz={handleStartNewQuiz} />;
      case 'REVIEW':
        return activeResult && <QuizReview result={activeResult} onBackToDashboard={() => setView('DASHBOARD')} />;
      case 'ERROR':
        return (
          <div className="text-center p-8 bg-[var(--bg-secondary)] rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h2>
            <p className="text-[var(--text-secondary)] mb-6">{error}</p>
            <button
              onClick={() => user && apiKey ? setView('UPLOAD') : setView('API_KEY_SETUP')}
              className="bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-opacity"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
     <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        {user && apiKey && <Header user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} onNavigateToDashboard={() => setView('DASHBOARD')} onEditApiKey={handleEditApiKey} />}
        <main className={user && apiKey ? 'mt-8' : ''}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;