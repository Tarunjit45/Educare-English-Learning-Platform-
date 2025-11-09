
import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import PhotographIcon from './icons/PhotographIcon';


interface ContentUploaderProps {
  onContentProcessed: (text: string, fileData?: { base64: string; mimeType: string; }) => void;
  error: string | null;
}

const ContentUploader: React.FC<ContentUploaderProps> = ({ onContentProcessed, error }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsProcessing(true);
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        // Image or PDF file needs to be processed by Gemini for text extraction
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          onContentProcessed('', { base64: base64String, mimeType: selectedFile.type });
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Text file can be read directly
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileText = e.target?.result as string;
          setText(fileText);
          setIsProcessing(false);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleGenerateClick = () => {
    if (text) {
      setIsProcessing(true);
      onContentProcessed(text);
    }
  };

  const isTextFile = file?.type.startsWith('text/') || file?.type === 'application/pdf';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Material</h2>
      <p className="text-gray-600 mb-6">Upload a text file (.txt, .md), a PDF, or a clear photo of your text (.jpg, .png).</p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".txt,.md,.pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        {!file && (
            <label htmlFor="file-upload" className="cursor-pointer">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">TXT, MD, PDF, PNG, JPG, JPEG</p>
            </label>
        )}
        
        {file && (
            <div className="text-left">
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border">
                    { isTextFile ? <DocumentTextIcon className="h-8 w-8 text-blue-500" /> : <PhotographIcon className="h-8 w-8 text-green-500" /> }
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{fileName}</p>
                        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

      {text && !isProcessing && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Text Preview:</h3>
          <div className="max-h-40 overflow-y-auto bg-gray-100 p-4 rounded-md border text-sm text-gray-700">
            {text}
          </div>
          <button
            onClick={handleGenerateClick}
            disabled={isProcessing}
            className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 transition-colors duration-200"
          >
            Generate Quiz from Text
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentUploader;