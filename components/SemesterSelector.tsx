
import React from 'react';
import { ClassLevel, PrimaryClass } from '../types';

interface SemesterSelectorProps {
  primaryClass: PrimaryClass;
  onSemesterSelect: (classLevel: ClassLevel) => void;
}

const SemesterSelector: React.FC<SemesterSelectorProps> = ({ primaryClass, onSemesterSelect }) => {
  
  const semesters = primaryClass === 'XI' 
    ? [{ name: '1st Sem', value: ClassLevel.XI_SEM_1 }, { name: '2nd Sem', value: ClassLevel.XI_SEM_2 }]
    : [{ name: '3rd Sem', value: ClassLevel.XII_SEM_3 }, { name: '4th Sem', value: ClassLevel.XII_SEM_4 }];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Select Semester for Class {primaryClass}</h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-lg">Choose your current semester to get tailored questions.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        {semesters.map((sem) => (
          <button
            key={sem.value}
            onClick={() => onSemesterSelect(sem.value)}
            className="w-full sm:w-48 p-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-xl sm:text-2xl font-semibold">{sem.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemesterSelector;