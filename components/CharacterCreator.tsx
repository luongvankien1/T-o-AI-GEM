
import React, { useState, useRef } from 'react';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';
import { fileToBase64 } from '../utils/fileUtils';

interface CharacterCreatorProps {
  onAddCharacter: (name: string, imageData: string) => Promise<void>;
  isGenerating: boolean;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onAddCharacter, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [characterName, setCharacterName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !characterName.trim()) {
      alert("Please provide both a character name and a description.");
      return;
    }
    await onAddCharacter(characterName, prompt);
    setPrompt('');
    setCharacterName('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!characterName.trim()) {
        const newName = promptForName();
        if(!newName) return; 
        setCharacterName(newName);
        const imageData = await fileToBase64(file);
        await onAddCharacter(newName, imageData);
      } else {
        const imageData = await fileToBase64(file);
        await onAddCharacter(characterName, imageData);
      }
      setCharacterName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const promptForName = (): string | null => {
      return window.prompt("Please enter a name for the uploaded character:");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">1. Create a New Character</h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Character Name (e.g., 'Heroic Knight')"
          className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          required
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your character... (e.g., 'A girl with long red hair, wearing a blue dress, smiling under the rain')"
          rows={3}
          className="w-full bg-gray-700 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim() || !characterName.trim()}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5" />
          Generate with AI
        </button>
      </form>

      <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400">Or</span>
          <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isGenerating || !characterName.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-5 h-5" />
        Upload Existing Character
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">Name the character first, then upload.</p>
    </div>
  );
};

export default CharacterCreator;
