import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onProcessingStart: () => void;
  onProgressUpdate: (progress: { current: number, total: number }) => void;
  onFileProcessed: (processedData: { type: 'text'; data: string } | { type: 'images'; data: string[]; mimeType: string }) => void;
}

if (typeof window !== 'undefined' && 'pdfjsLib' in window) {
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onProcessingStart, onProgressUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    if (!file) return;

    onProcessingStart();

    if (file.type.startsWith('image/')) {
      onProgressUpdate({ current: 0, total: 1 });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onProgressUpdate({ current: 1, total: 1 });
        onFileProcessed({ type: 'images', data: [base64String], mimeType: file.type });
      };
      reader.onerror = () => setError("Failed to read the image file.");
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        try {
            const pdfjsLib = (window as any).pdfjsLib;
            if (!pdfjsLib) {
                setError("PDF library is not available. Please refresh the page.");
                return;
            }
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            onProgressUpdate({ current: 0, total: pdf.numPages });
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
                onProgressUpdate({ current: i, total: pdf.numPages });
            }
            
            if (fullText.trim().length > 10) {
                onFileProcessed({ type: 'text', data: fullText });
            } else {
                console.warn("No text could be extracted from PDF, falling back to rendering ALL pages as images.");
                
                const base64Images: string[] = [];
                onProgressUpdate({ current: 0, total: pdf.numPages });
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (!context) {
                        throw new Error("Could not create canvas context to render PDF page.");
                    }

                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    base64Images.push(dataUrl.split(',')[1]);
                    onProgressUpdate({ current: i, total: pdf.numPages });
                }

                if (base64Images.length > 0) {
                    onFileProcessed({ type: 'images', data: base64Images, mimeType: 'image/jpeg' });
                } else {
                    setError("Failed to render any pages from the PDF as images.");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process the PDF. It might be corrupted, protected, or an image-based PDF where rendering failed.");
        }
    } else {
        setError("Unsupported file type. Please upload an image or a PDF.");
    }
  }, [onFileProcessed, onProcessingStart, onProgressUpdate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl shadow-2xl p-8 text-center">
       <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Create New Quiz</h2>
       <p className="text-lg text-[var(--text-secondary)] mb-8">Upload a document to get started.</p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-[var(--accent-primary)] bg-[var(--bg-primary)]' : 'border-[var(--text-secondary)]/50 hover:border-[var(--accent-secondary)] hover:bg-[var(--bg-primary)]/50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
        <p className="text-lg font-semibold text-[var(--text-primary)]">
          <span className="text-[var(--accent-secondary)]">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-[var(--text-secondary)]">PDF, PNG, JPG, or WEBP</p>
      </label>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
