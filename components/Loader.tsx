
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center animate-fade-in">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-semibold text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;