
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
            <div className="container mx-auto flex items-center gap-3">
                <SparklesIcon className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    AI Character & Scene Creator
                </h1>
            </div>
        </header>
    );
};

export default Header;
