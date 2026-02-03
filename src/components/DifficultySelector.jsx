import React from 'react';
import { DIFFICULTIES } from '../utils/difficultyUtils';
import { useTheme } from '../contexts/ThemeContext';

const DifficultySelector = ({ selectedDifficulty, onSelect, onClose }) => {
    const { currentTheme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

                <div className={`p-6 ${currentTheme.background} border-b border-gray-200 flex justify-between items-center`}>
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.gradientTitle} bg-clip-text text-transparent`}>
                        Select Difficulty
                    </h2>
                    {/* Allow closing without selection if one is already active (optional, typically we enforce selection on start) 
              But here we assume this might be called from a menu.
          */}
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-600 font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 grid gap-4">
                    {Object.values(DIFFICULTIES).map((diff) => (
                        <button
                            key={diff.id}
                            onClick={() => onSelect(diff.id)}
                            className={`
                relative p-4 rounded-xl border-2 text-left transition-all duration-300 group
                ${selectedDifficulty === diff.id
                                    ? `${diff.borderColor} ${diff.bg} ring-2 ring-offset-2 ring-purple-300`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
              `}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{diff.icon}</span>
                                <div>
                                    <h3 className={`font-bold text-lg ${diff.color}`}>
                                        {diff.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{diff.description}</p>
                                </div>

                                {selectedDifficulty === diff.id && (
                                    <div className="absolute right-4 text-purple-600 animate-pulse">
                                        ● Active
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default DifficultySelector;
