import React, { useState, useEffect } from 'react';
import { getLeaderboard, formatTime } from '../utils/leaderboardUtils';
import { useTheme } from '../contexts/ThemeContext';

const LeaderboardModal = ({ boardSize, isOpen, onClose }) => {
    const { currentTheme } = useTheme();
    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setScores(getLeaderboard(boardSize));
        }
    }, [isOpen, boardSize]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className={`p-6 ${currentTheme.background} border-b border-gray-200`}>
                    <div className="flex justify-between items-center">
                        <h2 className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.gradientTitle} bg-clip-text text-transparent`}>
                            🏆 Leaderboard ({boardSize}×{boardSize})
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-600 font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 flex-grow bg-white">
                    {scores.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="text-4xl mb-2">📉</div>
                            <p>No records yet. Be the first!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                                <span>Rank</span>
                                <span className="col-span-2">Time</span>
                                <span className="text-right">Moves</span>
                            </div>
                            {scores.map((score, index) => (
                                <div
                                    key={score.id}
                                    className={`
                    grid grid-cols-4 p-4 rounded-xl items-center
                    ${index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                                            index === 1 ? 'bg-gray-50 border border-gray-200' :
                                                index === 2 ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'}
                    transition-colors
                  `}
                                >
                                    <div className="font-bold flex items-center gap-2">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className={`col-span-2 font-mono font-medium ${currentTheme.textHighlight}`}>
                                        {formatTime(score.timeMs)}
                                    </div>
                                    <div className="text-right text-gray-600 font-mono">
                                        {score.moves}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
                    Records are stored locally on your device.
                </div>
            </div>
        </div>
    );
};

export default LeaderboardModal;
