
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface LoaderProps {
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "AI is thinking..." }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
        <div className="animate-pulse text-cyan-400">
            <SparklesIcon className="w-16 h-16" />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-300">{text}</p>
    </div>
);

export default Loader;
