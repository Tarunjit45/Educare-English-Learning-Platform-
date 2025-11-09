
import React from 'react';
import { Quiz, Question, MCQOption } from '../types';

interface GeneratedQuestionsViewProps {
  quiz: Quiz;
  onRestart: () => void;
}

const QuestionDisplay: React.FC<{ question: Question; questionNumber: number; }> = ({ question, questionNumber }) => {
    const renderMCQOptions = (options: MCQOption[], correctAnswer: string) => (
        <div className="space-y-3 mt-4">
            {options.map((option, index) => {
                const isCorrect = option.text === correctAnswer;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                
                return (
                    <div 
                        key={index} 
                        className={`flex items-start p-3 rounded-md border ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-gray-50'}`}
                    >
                        <span className={`font-semibold mr-2 ${isCorrect ? 'text-green-800' : 'text-gray-700'}`}>{optionLetter}.</span>
                        <span className={`${isCorrect ? 'text-green-800 font-medium' : 'text-gray-700'}`}>{option.text}</span>
                    </div>
                );
            })}
        </div>
    );

    const renderTextAnswer = (answer: string) => (
        <div className="mt-3">
            <p className="text-sm font-medium text-gray-500">Model Answer:</p>
            <p className="p-3 bg-blue-50 border border-blue-200 rounded-md text-gray-800">{answer}</p>
        </div>
    );
    
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4">
            <p className="font-semibold text-gray-800">{questionNumber}. {question.questionText}</p>
            {question.type === 'MCQ' && question.options && renderMCQOptions(question.options, question.answer)}
            {(question.type === 'SAQ' || question.type === 'BROAD' || question.type === 'GRAMMAR') && renderTextAnswer(question.answer)}
        </div>
    );
};


const GeneratedQuestionsView: React.FC<GeneratedQuestionsViewProps> = ({ quiz, onRestart }) => {
  let questionCounter = 0;

  const sections = [
      {title: "Multiple Choice Questions", questions: quiz.mcqs},
      {title: "Short Answer Questions", questions: quiz.saqs},
      {title: "Broad Questions", questions: quiz.broads},
      {title: "Grammar", questions: quiz.grammars},
  ];

  const handleDownload = () => {
    let formattedContent = "EduCare Generated Quiz\n\n";
    
    const formatSection = (title: string, questions: Question[] | null | undefined) => {
        if (!questions || questions.length === 0) return;

        formattedContent += `================================\n`;
        formattedContent += `${title}\n`;
        formattedContent += `================================\n\n`;
        
        questions.forEach((q, index) => {
            formattedContent += `${index + 1}. ${q.questionText}\n`;

            if (q.type === 'MCQ' && q.options) {
                q.options.forEach((opt, optIndex) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    formattedContent += `   ${optionLetter}. ${opt.text}\n`;
                });
                formattedContent += `   Correct Answer: ${q.answer}\n\n`;
            } else {
                formattedContent += `   Model Answer: ${q.answer}\n\n`;
            }
        });
    };

    sections.forEach(section => formatSection(section.title, section.questions));

    if (formattedContent === "EduCare Generated Quiz\n\n") {
        alert("No questions to download.");
        return;
    }

    const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'educare-quiz.txt');
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Generated Questions</h1>
      
      {sections.map(({title, questions}) => {
            if (!questions || questions.length === 0) {
                return null;
            }
            return (
                 <div key={title} className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-semibold border-b-2 border-blue-500 pb-2 mb-6">{title}</h2>
                    {questions.map(q => {
                        questionCounter++;
                        return <QuestionDisplay key={q.id} question={q} questionNumber={questionCounter} />
                    })}
                </div>
            )
        })}

      <div className="text-center mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
        >
          Generate from New Material
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
        >
          Download Questions
        </button>
      </div>
    </div>
  );
};

export default GeneratedQuestionsView;