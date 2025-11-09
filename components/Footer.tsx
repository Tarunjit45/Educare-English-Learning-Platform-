import React from 'react';
import StarIcon from './icons/StarIcon';

const Footer: React.FC = () => {
    const reviews = [
        {
            name: 'Priya Sharma',
            text: 'The AI-generated quizzes are fantastic! They cover every part of the chapter and have helped me score better than ever.'
        },
        {
            name: 'Rohan Mehta',
            text: 'Mr. Biswas is an excellent teacher. His guidance, combined with this amazing tool, makes learning English so much easier.'
        },
        {
            name: 'Anjali Gupta',
            text: 'I love how I can just upload a photo of my textbook and get a full quiz. This is the best study tool for English.'
        }
    ];

    return (
        <footer className="bg-gray-800 text-gray-300 pt-12 pb-8 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-blue-500 pb-2">EduCare: English Learning Center</h3>
                        <p className="mb-2"><strong>Run by:</strong> Dilip Biswas</p>
                        <p className="mb-2"><strong>Address:</strong> UdayNarayanpur, Howrah</p>
                        <p className="mb-2">
                            <strong>Mobile:</strong> <a href="tel:7980371378" className="text-blue-400 hover:text-blue-300">7980371378</a>
                        </p>
                        <p className="mb-2">
                            <strong>Email:</strong> <a href="mailto:dilipbiswas156@gmail.com" className="text-blue-400 hover:text-blue-300">dilipbiswas156@gmail.com</a>
                        </p>
                    </div>

                    {/* Student Reviews */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-blue-500 pb-2">Student Testimonials</h3>
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <div key={index} className="bg-gray-700 p-3 rounded-lg">
                                    <div className="flex text-yellow-400 mb-1">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-4 w-4" />)}
                                    </div>
                                    <p className="text-sm italic">"{review.text}"</p>
                                    <p className="text-right text-xs font-semibold mt-1">- {review.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Developer Info */}
                     <div>
                        <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-blue-500 pb-2">Developer</h3>
                         <p className="mb-2"><strong>Developed by:</strong> Tarunjit Biswas</p>
                         <p className="mb-2">
                            <strong>Contact:</strong> <a href="mailto:tarunjitbiswas24@gmail.com" className="text-blue-400 hover:text-blue-300">tarunjitbiswas24@gmail.com</a>
                        </p>
                    </div>

                </div>

                <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} EduCare: English Learning Center. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;