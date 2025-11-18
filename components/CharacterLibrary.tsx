
import React from 'react';
import { Character } from '../types';
import TrashIcon from './icons/TrashIcon';

interface CharacterLibraryProps {
  characters: Character[];
  selectedCharacterIds: string[];
  onSelectCharacter: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
}

const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  characters,
  selectedCharacterIds,
  onSelectCharacter,
  onDeleteCharacter
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">2. Character Library</h2>
      {characters.length === 0 ? (
        <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-600 rounded-lg">
          <p>Your character library is empty.</p>
          <p className="text-sm">Create a character to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((char) => {
            const isSelected = selectedCharacterIds.includes(char.id);
            return (
              <div
                key={char.id}
                className={`relative group rounded-lg overflow-hidden cursor-pointer border-4 ${
                  isSelected ? 'border-cyan-500' : 'border-transparent'
                } transition-all duration-300`}
                onClick={() => onSelectCharacter(char.id)}
              >
                <img
                  src={char.imageData}
                  alt={char.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold truncate">{char.name}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCharacter(char.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                  aria-label={`Delete ${char.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CharacterLibrary;
