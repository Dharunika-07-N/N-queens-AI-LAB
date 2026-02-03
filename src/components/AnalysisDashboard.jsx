import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { calculateAllSolutions, generateHeatmapData, getDifficultyRating } from '../utils/analysisUtils';

const AnalysisDashboard = ({ boardSize, isOpen, onClose }) => {
    const { currentTheme } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Use setTimeout to allow UI to render opening state before heavy calculation
            setTimeout(() => {
                const sols = calculateAllSolutions(boardSize);
                const heatmap = generateHeatmapData(boardSize, sols);
                setData(heatmap);
                setLoading(false);
            }, 100);
        }
    }, [isOpen, boardSize]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center transition-all font-bold text-xl shadow-md"
                >
                    ×
                </button>

                <div className="flex h-full flex-col lg:flex-row">

                    {/* Sidebar Stats */}
                    <div className={`w-full lg:w-1/3 ${currentTheme.background} p-8 border-r border-gray-200 overflow-y-auto`}>
                        <h2 className={`text-3xl font-bold bg-gradient-to-br ${currentTheme.gradientTitle} bg-clip-text text-transparent mb-2`}>
                            AI Analysis
                        </h2>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="bg-black text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-bold">Module 47</span>
                            <span className="text-gray-500 font-mono text-sm">N={boardSize}</span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                <p className="text-gray-500 animate-pulse">Running Deep Analysis...</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Total Solutions</div>
                                    <div className="text-4xl font-black text-gray-800">{data?.totalSolutions.toLocaleString()}</div>
                                </div>

                                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Difficulty Rating</div>
                                    <div className={`text-xl font-bold ${currentTheme.textHighlight}`}>
                                        {getDifficultyRating(boardSize)}
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">Search Space</div>
                                    <div className="text-lg font-mono text-gray-600">
                                        {boardSize}<sup>{boardSize}</sup> ≈ {(Math.pow(boardSize, boardSize)).toExponential(2)}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Possible configurations</div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-bold text-gray-800 mb-2">Heatmap Insights</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Darker squares indicate positions used more frequently across all {data?.totalSolutions} valid solutions.
                                        Queens placed in these "hotspots" are statistically more likely to be part of a solution using standard backtracking.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visualization Area */}
                    <div className="flex-grow bg-gray-50 flex items-center justify-center p-4 lg:p-10 relative overflow-hidden">
                        {/* Simple Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}></div>

                        {!loading && data && (
                            <div
                                className="relative shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800 animate-zoom-in"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                                    width: 'min(100%, 600px)',
                                    aspectRatio: '1',
                                }}
                            >
                                {data.grid.map((row, rIndex) => (
                                    row.map((count, cIndex) => {
                                        const frequency = count / data.totalSolutions;
                                        const isDark = (rIndex + cIndex) % 2 === 1;
                                        const opacity = Math.max(0.05, frequency * 3); // Amplify for visibility

                                        return (
                                            <div
                                                key={`${rIndex}-${cIndex}`}
                                                className={`relative flex items-center justify-center group border-[0.5px] border-black/5 ${isDark ? 'bg-gray-100' : 'bg-white'}`}
                                            >
                                                {/* Heatmap Overlay */}
                                                <div
                                                    className="absolute inset-0 bg-red-600 transition-all duration-500"
                                                    style={{ opacity: count === 0 ? 0 : opacity }}
                                                />

                                                {/* Tooltip on Hover */}
                                                <div className="hidden group-hover:flex absolute z-20 -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                                                    {(frequency * 100).toFixed(1)}% ({count})
                                                </div>

                                                {/* Text for High Frequency */}
                                                {frequency > 0.15 && (
                                                    <span className="relative z-10 text-[10px] md:text-sm font-bold text-white/90 drop-shadow-md">
                                                        {(frequency * 100).toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalysisDashboard;
