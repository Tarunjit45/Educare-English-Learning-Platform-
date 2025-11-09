import React, { useState, useCallback } from 'react';
import { ClassLevel, Quiz, PrimaryClass } from './types';
import Header from './components/Header';
import ClassSelector from './components/ClassSelector';
import ContentUploader from './components/ContentUploader';
import GeneratedQuestionsView from './components/GeneratedQuestionsView';
import Loader from './components/Loader';
import { extractTextFromFile, generateMCQs, generateSAQs, generateMCQsForSem1And3, generateSAQsForSem2And4, generateBroadsForSem2And4, generateGrammarForSem2And4 } from './services/geminiService';
import SemesterSelector from './components/SemesterSelector';

type AppState = 'SELECT_CLASS' | 'SELECT_SEMESTER' | 'UPLOAD_CONTENT' | 'GENERATING_QUESTIONS' | 'VIEW_QUESTIONS';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('SELECT_CLASS');
  const [primaryClass, setPrimaryClass] = useState<PrimaryClass | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClassSelect = (classLevel: PrimaryClass) => {
    if (classLevel === 'XI' || classLevel === 'XII') {
        setPrimaryClass(classLevel);
        setAppState('SELECT_SEMESTER');
    } else {
        setSelectedClass(classLevel as ClassLevel);
        setAppState('UPLOAD_CONTENT');
    }
    setError(null);
  };

  const handleSemesterSelect = (classLevel: ClassLevel) => {
    setSelectedClass(classLevel);
    setAppState('UPLOAD_CONTENT');
    setError(null);
  };


  const handleContentProcessed = async (text: string, fileData?: { base64: string, mimeType: string }) => {
    setError(null);
    let contentToProcess = text;
    setAppState('GENERATING_QUESTIONS');

    try {
      if (fileData && !text) {
        contentToProcess = await extractTextFromFile(fileData.base64, fileData.mimeType);
      }
      
      if (!selectedClass) {
        throw new Error("No class or semester selected.");
      }
      
      let generatedQuiz: Quiz = {};

      switch (selectedClass) {
        case ClassLevel.VIII:
        case ClassLevel.IX:
        case ClassLevel.X:
          const [mcqs, saqs] = await Promise.all([
            generateMCQs(selectedClass, contentToProcess),
            generateSAQs(selectedClass, contentToProcess)
          ]);
          generatedQuiz = { mcqs, saqs };
          break;
        
        case ClassLevel.XI_SEM_1:
        case ClassLevel.XII_SEM_3:
          const sem1_3_mcqs = await generateMCQsForSem1And3(selectedClass, contentToProcess);
          generatedQuiz = { mcqs: sem1_3_mcqs };
          break;

        case ClassLevel.XI_SEM_2:
        case ClassLevel.XII_SEM_4:
          const [sem2_4_saqs, sem2_4_broads, sem2_4_grammars] = await Promise.all([
            generateSAQsForSem2And4(selectedClass, contentToProcess),
            generateBroadsForSem2And4(selectedClass, contentToProcess),
            generateGrammarForSem2And4(selectedClass, contentToProcess)
          ]);
          generatedQuiz = { saqs: sem2_4_saqs, broads: sem2_4_broads, grammars: sem2_4_grammars };
          break;
        
        default:
           throw new Error("Invalid class selection.");
      }

      setQuiz(generatedQuiz);
      setAppState('VIEW_QUESTIONS');

    } catch (e) {
      console.error("Error during content processing or quiz generation:", e);
      setError("Failed to generate questions. The content might be unsuitable, or there was a network issue. Please try again.");
      setAppState('UPLOAD_CONTENT');
    }
  };

  const handleRestart = () => {
    setAppState('SELECT_CLASS');
    setSelectedClass(null);
    setPrimaryClass(null);
    setQuiz(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'SELECT_CLASS':
        return <ClassSelector onClassSelect={handleClassSelect} />;
      case 'SELECT_SEMESTER':
        return primaryClass && <SemesterSelector primaryClass={primaryClass} onSemesterSelect={handleSemesterSelect} />;
      case 'UPLOAD_CONTENT':
        return <ContentUploader onContentProcessed={handleContentProcessed} error={error} />;
      case 'GENERATING_QUESTIONS':
        return <Loader message="AI is crafting your questions... This may take a moment." />;
      case 'VIEW_QUESTIONS':
        return quiz && <GeneratedQuestionsView quiz={quiz} onRestart={handleRestart} />;
      default:
        return <ClassSelector onClassSelect={handleClassSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header onHomeClick={handleRestart} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
