import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { CAMPAIGN_LEVELS, getCampaignProgress } from '../utils/campaignUtils';

const CampaignMap = ({ onSelectLevel, onBack }) => {
    const { currentTheme } = useTheme();
    const currentProgress = getCampaignProgress();

    return (
        <div className={`min-h-screen ${currentTheme.background} p-4 md:p-8 flex flex-col items-center`}>

            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className={`${currentTheme.buttonSecondary} px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg`}
                >
                    ← Back to Menu
                </button>
                <h1 className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.gradientTitle} bg-clip-text text-transparent`}>
                    Campaign Mode
                </h1>
                <div className="w-24"></div> {/* Spacer */}
            </div>

            {/* Level Path */}
            <div className="relative w-full max-w-3xl flex flex-col gap-8 pb-20">

                {/* Connecting Line (Visual) */}
                <div className="absolute left-1/2 top-10 bottom-10 w-2 bg-gray-200/50 -translate-x-1/2 rounded-full z-0"></div>

                {CAMPAIGN_LEVELS.map((level, index) => {
                    const isUnlocked = level.id <= currentProgress;
                    const isCompleted = level.id < currentProgress;
                    const isCurrent = level.id === currentProgress;

                    return (
                        <div
                            key={level.id}
                            className={`flex z-10 w-full ${index % 2 === 0 ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`
                        relative w-[45%] bg-white rounded-2xl shadow-xl p-6 border-4 transition-all duration-300
                        ${isUnlocked ? 'border-purple-200 cursor-pointer hover:scale-105 hover:border-purple-400' : 'border-gray-100 opacity-60 grayscale cursor-not-allowed'}
                        ${isCurrent ? 'ring-4 ring-purple-400 ring-offset-4' : ''}
                    `}
                                onClick={() => isUnlocked && onSelectLevel(level)}
                            >
                                {/* Status Badge */}
                                <div className="absolute -top-3 -right-3">
                                    {isCompleted ? (
                                        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">✓</div>
                                    ) : isCurrent ? (
                                        <div className="bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md animate-bounce">★</div>
                                    ) : (
                                        <div className="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">🔒</div>
                                    )}
                                </div>

                                <h3 className="font-bold text-xl text-gray-800 mb-1">Level {level.id}: {level.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">{level.description}</p>

                                <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{level.boardSize}x{level.boardSize}</span>
                                    <span className={`px-2 py-1 rounded 
                            ${level.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                            level.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' :
                                                level.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                        {level.difficulty}
                                    </span>
                                </div>

                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default CampaignMap;
