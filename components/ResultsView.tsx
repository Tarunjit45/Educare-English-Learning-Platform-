
import React from 'react';
import { Result, Quiz, Question } from '../types';

interface ResultsViewProps {
  result: Result;
  quiz: Quiz;
  answers: Record<string, string>;
  onRestart: () => void;
}

const getQuestionById = (quiz: Quiz, id: string): Question | undefined => {
    // FIX: Removed 'broads' and 'grammars' as they are not part of the Quiz type.
    return [
        ...(quiz.mcqs || []),
        ...(quiz.saqs || []),
    ].find(q => q.id === id);
};

const ResultsView: React.FC<ResultsViewProps> = ({ result, quiz, answers, onRestart }) => {
  const scoreColor = result.score >= 80 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Quiz Results</h1>
        <div className={`text-6xl sm:text-7xl font-bold my-4 ${scoreColor}`}>{result.score}%</div>
        <p className="text-lg text-gray-700 bg-gray-100 p-4 rounded-md">{result.feedback}</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 border-b pb-2">Detailed Analysis</h2>
        <div className="space-y-6">
          {result.detailedAnalysis.map((analysis, index) => {
            const question = getQuestionById(quiz, analysis.questionId);
            return (
              <div key={analysis.questionId} className="border p-4 rounded-lg bg-gray-50">
                <p className="font-semibold text-gray-800 mb-2">{index + 1}. {question?.questionText}</p>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-500">Your Answer:</p>
                  <p className="p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
                    {analysis.studentAnswer || <span className="italic text-gray-500">Not answered</span>}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Correct Answer:</p>
                  <p className="p-2 bg-green-50 border border-green-200 rounded-md text-gray-700">{analysis.correctAnswer}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Feedback:</p>
                  <p className="p-2 bg-yellow-50 border border-yellow-200 rounded-md text-gray-700">{analysis.evaluation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center mt-8">
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
        >
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsView;