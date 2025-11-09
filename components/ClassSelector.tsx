
import React from 'react';
import { ClassLevel, PrimaryClass } from '../types';

interface ClassSelectorProps {
  onClassSelect: (classLevel: PrimaryClass) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ onClassSelect }) => {
  const classes: PrimaryClass[] = [ClassLevel.VIII, ClassLevel.IX, ClassLevel.X, ClassLevel.XI, ClassLevel.XII];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome to EduCare!</h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-lg">Please select your class to begin.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {classes.map((level) => (
          <button
            key={level}
            onClick={() => onClassSelect(level)}
            className="p-4 sm:p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-xl sm:text-2xl font-semibold">Class {level}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassSelector;