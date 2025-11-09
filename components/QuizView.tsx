
import React, { useState } from 'react';
import { Quiz, Question } from '../types';

interface QuizViewProps {
  quiz: Quiz;
  onSubmit: (answers: Record<string, string>) => void;
  error: string | null;
}

const QuestionCard: React.FC<{ question: Question; questionNumber: number; onAnswerChange: (id: string, value: string) => void; }> = ({ question, questionNumber, onAnswerChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <p className="font-semibold text-gray-800 mb-4">{questionNumber}. {question.questionText}</p>
            {question.type === 'MCQ' && question.options && (
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                        return (
                            <label key={index} className="flex items-center p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option.text}
                                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-gray-700">
                                    <span className="font-semibold mr-2">{optionLetter}.</span>{option.text}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
            {/* FIX: Removed 'BROAD' and 'GRAMMAR' types as they are not defined in the Question type. */}
            {question.type === 'SAQ' && (
                <textarea
                    // FIX: Hardcoded rows to 2 since 'BROAD' type is removed.
                    rows={2}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Your answer..."
                />
            )}
        </div>
    );
};

const SectionLoader: React.FC<{ title: string }> = ({ title }) => (
    <div className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold border-b-2 border-gray-300 pb-2 mb-6 text-gray-500">{title}</h2>
        <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-8 h-8 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-gray-600">Generating questions...</p>
        </div>
    </div>
);


const QuizView: React.FC<QuizViewProps> = ({ quiz, onSubmit, error }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // FIX: Removed 'broads' and 'grammars' sections as they are not part of the Quiz type.
  const sections = [
      {title: "Multiple Choice Questions", questions: quiz.mcqs},
      {title: "Short Answer Questions", questions: quiz.saqs},
  ];
  
  const isFullyLoaded = sections.every(sec => sec.questions !== null);
  const loadedQuestions = sections.flatMap(sec => sec.questions || []);
  const totalQuestions = loadedQuestions.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullyLoaded) return;

    if (Object.keys(answers).length < totalQuestions) {
        if (!confirm("You have not answered all questions. Are you sure you want to submit?")) {
            return;
        }
    }
    onSubmit(answers);
  };
  
  let questionCounter = 0;

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Your Quiz</h1>
        {sections.map(({title, questions}) => {
            if (questions === null) {
                return <SectionLoader key={title} title={title} />;
            }
            if (questions.length === 0) {
                return null;
            }
            return (
                 <div key={title} className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-6">{title}</h2>
                    {questions.map(q => {
                        questionCounter++;
                        return <QuestionCard key={q.id} question={q} questionNumber={questionCounter} onAnswerChange={handleAnswerChange} />
                    })}
                </div>
            )
        })}
        
        {error && <div className="my-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 border-t">
          <div className="max-w-4xl mx-auto px-4">
              <button
                type="submit"
                disabled={!isFullyLoaded}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-wait transition-colors duration-200"
              >
                {isFullyLoaded ? 'Submit for Scoring' : 'Waiting for all questions to load...'}
              </button>
          </div>
        </div>
    </form>
  );
};

export default QuizView;