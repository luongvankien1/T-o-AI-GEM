
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import CharacterCreator from './components/CharacterCreator';
import CharacterLibrary from './components/CharacterLibrary';
import SceneCreator from './components/SceneCreator';
import ResultViewer from './components/ResultViewer';
import Loader from './components/Loader';
import { Character, AspectRatio } from './types';
import { generateCharacter, generateScene, editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

type View = 'library' | 'scene_creator' | 'result';

const App: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("AI is thinking...");
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<View>('library');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [lastSceneData, setLastSceneData] = useState<{ prompt: string, aspectRatio: AspectRatio } | null>(null);

    const handleAddCharacter = useCallback(async (name: string, data: string) => {
        setIsLoading(true);
        setError(null);
        try {
            let imageData: string;
            // Check if data is a prompt (not a data URL)
            if (!data.startsWith('data:image')) {
                setLoadingText("Generating Character...");
                imageData = await generateCharacter(data);
            } else {
                setLoadingText("Uploading Character...");
                imageData = data;
            }
            const newCharacter: Character = { id: Date.now().toString(), name, imageData };
            setCharacters(prev => [...prev, newCharacter]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setLoadingText("AI is thinking...");
        }
    }, []);

    const handleDeleteCharacter = useCallback((id: string) => {
        setCharacters(prev => prev.filter(char => char.id !== id));
        setSelectedCharacterIds(prev => prev.filter(charId => charId !== id));
    }, []);

    const handleSelectCharacter = useCallback((id: string) => {
        setSelectedCharacterIds(prev =>
            prev.includes(id) ? prev.filter(charId => charId !== id) : [...prev, id]
        );
    }, []);
    
    const selectedCharacters = useMemo(() => 
      characters.filter(char => selectedCharacterIds.includes(char.id)), 
      [characters, selectedCharacterIds]
    );

    const handleStartSceneCreation = () => {
        if (selectedCharacters.length > 0) {
            setView('scene_creator');
        } else {
            alert('Please select at least one character to create a scene.');
        }
    };

    const handleGenerateScene = useCallback(async (prompt: string, aspectRatio: AspectRatio) => {
        if (selectedCharacters.length === 0) return;
        setIsLoading(true);
        setLoadingText("Generating Scene...");
        setError(null);
        setLastSceneData({ prompt, aspectRatio });
        try {
            const resultImage = await generateScene(selectedCharacters, prompt, aspectRatio);
            setGeneratedImage(resultImage);
            setView('result');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate scene.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setLoadingText("AI is thinking...");
        }
    }, [selectedCharacters]);

    const handleRegenerate = useCallback(() => {
        if (lastSceneData) {
            handleGenerateScene(lastSceneData.prompt, lastSceneData.aspectRatio);
        }
    }, [lastSceneData, handleGenerateScene]);

    const handleEditImage = useCallback(async (prompt: string) => {
        if (!generatedImage) return;
        setIsLoading(true);
        setLoadingText("Applying Edits...");
        setError(null);
        try {
            const resultImage = await editImage(generatedImage, prompt);
            setGeneratedImage(resultImage);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to edit image.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setLoadingText("AI is thinking...");
        }
    }, [generatedImage]);


    const renderContent = () => {
        switch (view) {
            case 'scene_creator':
                return <SceneCreator 
                            selectedCharacters={selectedCharacters} 
                            onGenerateScene={handleGenerateScene} 
                            isGenerating={isLoading}
                            onBack={() => setView('library')}
                        />;
            case 'result':
                return generatedImage ? 
                        <ResultViewer 
                            image={generatedImage}
                            onRegenerate={handleRegenerate}
                            onEdit={handleEditImage}
                            onBack={() => setView('scene_creator')}
                            isGenerating={isLoading}
                        /> : null;
            case 'library':
            default:
                return (
                    <div className="space-y-8">
                        <CharacterCreator onAddCharacter={handleAddCharacter} isGenerating={isLoading} />
                        <CharacterLibrary 
                            characters={characters} 
                            selectedCharacterIds={selectedCharacterIds}
                            onSelectCharacter={handleSelectCharacter}
                            onDeleteCharacter={handleDeleteCharacter}
                        />
                        {selectedCharacters.length > 0 && (
                            <div className="fixed bottom-8 right-8 z-20">
                                <button
                                    onClick={handleStartSceneCreation}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-transform hover:scale-105"
                                >
                                    Create Scene with {selectedCharacters.length} Character{selectedCharacters.length > 1 ? 's' : ''}
                                </button>
                            </div>
                        )}
                    </div>
                );
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {isLoading && <Loader text={loadingText} />}
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
