import React from 'react';

interface ProcessingPageProps {
  progress: {
    current: number;
    total: number;
  };
  title?: string;
  subtitle?: string;
  progressLabel?: string;
}

const ProcessingPage: React.FC<ProcessingPageProps> = ({ 
    progress, 
    title = "Preparing Your Document...", 
    subtitle = "This might take a moment for large files.",
    progressLabel = "Processing page" 
}) => {
  const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-secondary)] rounded-xl shadow-2xl">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--accent-primary)]"></div>
      <h2 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-2 text-lg text-[var(--text-secondary)]">
        {subtitle}
      </p>

      {progress.total > 0 && (
        <div className="w-full max-w-md mt-8">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-[var(--text-secondary)]">{progressLabel} {progress.current} of {progress.total}</span>
                <span className="text-sm font-medium text-[var(--text-secondary)]">{percentage}%</span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] rounded-full h-2.5">
                <div 
                    className="bg-[var(--accent-primary)] h-2.5 rounded-full transition-all duration-300 ease-linear" 
                    style={{width: `${percentage}%`}}
                ></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingPage;
