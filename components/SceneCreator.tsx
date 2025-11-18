
import React, { useState } from 'react';
import { Character, AspectRatio } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface SceneCreatorProps {
  selectedCharacters: Character[];
  onGenerateScene: (prompt: string, aspectRatio: AspectRatio) => void;
  isGenerating: boolean;
  onBack: () => void;
}

const SceneCreator: React.FC<SceneCreatorProps> = ({ selectedCharacters, onGenerateScene, isGenerating, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please describe the scene.");
      return;
    }
    onGenerateScene(prompt, aspectRatio);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">Create Scene</h2>
        <button onClick={onBack} className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Library
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Selected Characters:</h3>
        <div className="flex flex-wrap gap-2 p-2 bg-gray-900 rounded-lg">
          {selectedCharacters.map(char => (
            <div key={char.id} className="flex items-center gap-2 bg-gray-700 p-1 pr-2 rounded-full">
              <img src={char.imageData} alt={char.name} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-medium">{char.name}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the scene... (e.g., 'In an autumn forest, with soft sunlight, the characters are sitting and reading books')"
          rows={4}
          className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          required
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Aspect Ratio:</h3>
          <div className="flex gap-4">
            {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
              <label key={ratio} className={`block p-3 w-28 text-center rounded-lg cursor-pointer border-2 transition-colors ${aspectRatio === ratio ? 'bg-cyan-600 border-cyan-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}>
                <input
                  type="radio"
                  name="aspectRatio"
                  value={ratio}
                  checked={aspectRatio === ratio}
                  onChange={() => setAspectRatio(ratio)}
                  className="sr-only"
                />
                <span className="font-bold">{ratio}</span>
                <span className="text-xs block text-gray-300">{ratio === '16:9' ? 'Landscape' : 'Portrait'}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5" />
          Generate Scene
        </button>
      </form>
    </div>
  );
};

export default SceneCreator;
