
import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';

interface HeaderProps {
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={onHomeClick}
        >
          <BookOpenIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            EduCare <span className="font-normal text-blue-600 hidden sm:inline">English Learning Center</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;