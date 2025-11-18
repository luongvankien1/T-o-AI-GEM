
import React, { useState } from 'react';
import { ImageFormat } from '../types';
import { downloadImage } from '../utils/fileUtils';
import DownloadIcon from './icons/DownloadIcon';
import EditIcon from './icons/EditIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ResultViewerProps {
  image: string;
  onRegenerate: () => void;
  onEdit: (prompt: string) => void;
  onBack: () => void;
  isGenerating: boolean;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ image, onRegenerate, onEdit, onBack, isGenerating }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<ImageFormat>('png');

  const handleEditSubmit = () => {
    if (!editPrompt.trim()) {
      alert("Please describe the change you want to make.");
      return;
    }
    onEdit(editPrompt);
    setShowEdit(false);
    setEditPrompt('');
  };

  const handleDownload = () => {
    downloadImage(image, `ai-scene-${Date.now()}`, downloadFormat);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg animate-fade-in">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">Generated Scene</h2>
        <button onClick={onBack} className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Back to Scene Creator
        </button>
      </div>

      <div className="mb-4 bg-black rounded-lg overflow-hidden flex justify-center items-center">
        <img src={image} alt="Generated scene" className="max-w-full max-h-[60vh] object-contain" />
      </div>

      {showEdit && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="e.g., 'change the background to a sunset'"
            className="flex-grow bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          />
          <button onClick={handleEditSubmit} disabled={isGenerating} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-600">
            Apply
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex gap-2">
            <button onClick={handleDownload} className="flex-grow flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                <DownloadIcon className="w-5 h-5"/> Download
            </button>
            <select value={downloadFormat} onChange={e => setDownloadFormat(e.target.value as ImageFormat)} className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WebP</option>
            </select>
        </div>

        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <EditIcon className="w-5 h-5"/> AI Edit Mode
        </button>
        <button onClick={onRegenerate} disabled={isGenerating} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600">
            <SparklesIcon className="w-5 h-5"/> Regenerate
        </button>
      </div>
    </div>
  );
};

export default ResultViewer;
