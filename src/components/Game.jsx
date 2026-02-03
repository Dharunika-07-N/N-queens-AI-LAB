import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { saveScore } from '../utils/leaderboardUtils';
import LeaderboardModal from './LeaderboardModal';
import AnalysisDashboard from './AnalysisDashboard';

const Game = ({ level, onBack, onComplete }) => {
    const { currentTheme } = useTheme();
    const { playSound, isMuted, toggleMute } = useSound();

    // Board configuration
    const boardSize = level;
    const [queens, setQueens] = useState(new Set());

    // Game state
    const [moveCount, setMoveCount] = useState(0);
    const [isVictory, setIsVictory] = useState(false);
    const [isSolving, setIsSolving] = useState(false);
    const [allowInvalidMoves, setAllowInvalidMoves] = useState(false);

    // Modals & Tools
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isNewHighScore, setIsNewHighScore] = useState(false);

    // UI state
    const [hintPosition, setHintPosition] = useState(null);
    const [invalidSquare, setInvalidSquare] = useState(null);
    const [confetti, setConfetti] = useState([]);

    // History for undo/redo
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Timer
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    // Reset when level changes
    useEffect(() => {
        clearBoard();
    }, [level]);

    // Attack Calculation
    const isUnderAttack = useCallback((row, col, currentQueens = queens) => {
        for (const pos of currentQueens) {
            const [qRow, qCol] = pos.split(',').map(Number);
            if (qRow === row) return true;
            if (qCol === col) return true;
            if (Math.abs(qRow - row) === Math.abs(qCol - col)) return true;
        }
        return false;
    }, [queens]);

    const getAttackedSquares = useMemo(() => {
        const attacked = new Set();
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (isUnderAttack(row, col)) {
                    attacked.add(`${row},${col}`);
                }
            }
        }
        return attacked;
    }, [boardSize, isUnderAttack]);

    // Victory Detection
    useEffect(() => {
        if (queens.size === boardSize && queens.size > 0) {
            let valid = true;
            const queensArray = Array.from(queens);
            for (let i = 0; i < queensArray.length; i++) {
                const [row, col] = queensArray[i].split(',').map(Number);
                const tempQueens = new Set(queensArray.filter((_, idx) => idx !== i));
                if (isUnderAttack(row, col, tempQueens)) {
                    valid = false;
                    break;
                }
            }

            if (valid && !isVictory) {
                setIsVictory(true);
                stopTimer();
                triggerConfetti();
                playSound('victory');

                // Save Score
                const isHigh = saveScore(boardSize, elapsedTime, moveCount);
                setIsNewHighScore(isHigh);

                if (onComplete) onComplete(boardSize, elapsedTime);
            }
        } else {
            setIsVictory(false);
        }
    }, [queens, boardSize, isUnderAttack, isVictory, onComplete, elapsedTime, moveCount, playSound]);

    // Timer
    const startTimer = () => {
        if (!startTime) {
            const now = Date.now();
            setStartTime(now);
            const interval = setInterval(() => {
                setElapsedTime(Date.now() - now);
            }, 100);
            setTimerInterval(interval);
        }
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    };

    const resetTimer = () => {
        stopTimer();
        setStartTime(null);
        setElapsedTime(0);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Click Handler
    const handleSquareClick = (row, col) => {
        if (isSolving || isVictory) return;

        const position = `${row},${col}`;
        const newQueens = new Set(queens);

        if (queens.size === 0 && !newQueens.has(position)) {
            startTimer();
        }

        if (newQueens.has(position)) {
            newQueens.delete(position);
            setQueens(newQueens);
            setMoveCount(moveCount - 1);
            addToHistory(newQueens);
            playSound('remove');
        } else {
            if (!allowInvalidMoves && isUnderAttack(row, col)) {
                setInvalidSquare(position);
                playSound('error');
                setTimeout(() => setInvalidSquare(null), 500);
                return;
            }
            newQueens.add(position);
            setQueens(newQueens);
            setMoveCount(moveCount + 1);
            setHintPosition(null);
            addToHistory(newQueens);
            playSound('place');
        }
    };

    // History
    const addToHistory = (newQueens) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(new Set(newQueens));
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setQueens(new Set(history[newIndex]));
            setMoveCount(history[newIndex].size);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setQueens(new Set(history[newIndex]));
            setMoveCount(history[newIndex].size);
        }
    };

    const clearBoard = () => {
        setQueens(new Set());
        setMoveCount(0);
        setIsVictory(false);
        setHintPosition(null);
        setInvalidSquare(null);
        setHistory([new Set()]);
        setHistoryIndex(0);
        resetTimer();
        setConfetti([]);
    };

    // Solver
    const solveNQueens = (n, currentQueens = new Set(), row = 0, solutions = []) => {
        if (row === n) {
            solutions.push(new Set(currentQueens));
            return solutions;
        }
        for (let col = 0; col < n; col++) {
            if (!isUnderAttack(row, col, currentQueens)) {
                const newQueens = new Set(currentQueens);
                newQueens.add(`${row},${col}`);
                solveNQueens(n, newQueens, row + 1, solutions);
            }
        }
        return solutions;
    };

    const solvePuzzle = async () => {
        setIsSolving(true);
        clearBoard();
        const solutions = solveNQueens(boardSize);
        if (solutions.length > 0) {
            const solution = Array.from(solutions[0]).sort((a, b) => {
                const [rowA] = a.split(',').map(Number);
                const [rowB] = b.split(',').map(Number);
                return rowA - rowB;
            });
            for (let i = 0; i < solution.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setQueens(prev => {
                    const newQueens = new Set(prev);
                    newQueens.add(solution[i]);
                    return newQueens;
                });
                setMoveCount(i + 1);
            }
        }
        setIsSolving(false);
    };

    const showHint = () => {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const position = `${row},${col}`;
                if (!queens.has(position) && !isUnderAttack(row, col)) {
                    setHintPosition(position);
                    setTimeout(() => setHintPosition(null), 3000);
                    return;
                }
            }
        }
    };

    const triggerConfetti = () => {
        const pieces = [];
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
        for (let i = 0; i < 50; i++) {
            pieces.push({
                id: i,
                left: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            });
        }
        setConfetti(pieces);
        setTimeout(() => setConfetti([]), 3000);
    };

    const renderBoard = () => {
        const board = [];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const position = `${row},${col}`;
                const hasQueen = queens.has(position);
                const isAttacked = getAttackedSquares.has(position) && !hasQueen;
                const isHint = hintPosition === position;
                const isInvalid = invalidSquare === position;
                const isLight = (row + col) % 2 === 0;

                // Theme colors
                let bgColor = isLight ? currentTheme.squareLight : currentTheme.squareDark;
                if (isAttacked) bgColor = 'bg-red-400 bg-opacity-70';
                if (isHint) bgColor = 'bg-green-400 animate-pulse';
                if (isInvalid) bgColor = 'bg-red-600 animate-ping';

                board.push(
                    <div
                        key={position}
                        onClick={() => handleSquareClick(row, col)}
                        className={`
              ${bgColor}
              aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 relative
              hover:opacity-90 hover:scale-105 z-0 hover:z-10
            `}
                        style={{ gridColumn: col + 1, gridRow: row + 1 }}
                    >
                        {hasQueen && (
                            <span className="text-4xl md:text-5xl select-none transition-all transform animate-bounce-small" style={{
                                color: isLight ? currentTheme.queenLight : currentTheme.queenDark,
                                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                            }}>
                                ♛
                            </span>
                        )}
                    </div>
                );
            }
        }
        return board;
    };

    return (
        <div className={`min-h-screen p-4 md:p-8 ${currentTheme.background} transition-colors duration-500`}>
            {/* Confetti */}
            {confetti.map(piece => (
                <div key={piece.id} className={`absolute w-2 h-2 animate-confetti ${piece.color}`}
                    style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, top: '-10px' }}
                />
            ))}

            <LeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                boardSize={boardSize}
            />

            <AnalysisDashboard
                boardSize={boardSize}
                isOpen={showAnalysis}
                onClose={() => setShowAnalysis(false)}
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 relative">
                    <button
                        onClick={onBack}
                        className={`absolute left-0 top-2 ${currentTheme.buttonSecondary} px-4 py-2 rounded-lg font-semibold flex items-center gap-2`}
                    >
                        ← Map
                    </button>

                    <div className="absolute right-0 top-2 flex gap-2">
                        <button
                            onClick={() => toggleMute()}
                            className={`${currentTheme.buttonSecondary} w-10 h-10 rounded-full flex items-center justify-center`}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className={`${currentTheme.buttonSecondary} w-10 h-10 rounded-full flex items-center justify-center`}
                            title="Leaderboard"
                        >
                            🏆
                        </button>
                        <button
                            onClick={() => setShowAnalysis(true)}
                            className={`${currentTheme.buttonSecondary} w-10 h-10 rounded-full flex items-center justify-center`}
                            title="AI Analysis Dashboard"
                        >
                            🔬
                        </button>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${currentTheme.gradientTitle} bg-clip-text text-transparent mb-2`}>
                        Level {boardSize - 3}: {boardSize} Queens
                    </h1>
                    <p className={`${currentTheme.textHighlight} text-lg`}>
                        {formatTime(elapsedTime)} • {queens.size}/{boardSize} Queens
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Sidebar Controls */}
                    <div className="flex flex-col gap-4 w-full lg:w-64 order-2 lg:order-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/50">
                            <h3 className={`font-bold ${currentTheme.textHighlight} mb-3`}>Controls</h3>
                            <div className="space-y-2">
                                <button onClick={showHint} className={`w-full ${currentTheme.buttonPrimary} px-4 py-2 rounded-md shadow transition-transform active:scale-95`} disabled={isSolving || isVictory}>
                                    💡 Hint
                                </button>
                                <button onClick={undo} className={`w-full ${currentTheme.buttonSecondary} px-4 py-2 rounded-md shadow transition-transform active:scale-95`} disabled={historyIndex <= 0 || isSolving}>
                                    ↶ Undo
                                </button>
                                <button onClick={clearBoard} className={`w-full ${currentTheme.buttonSecondary} px-4 py-2 rounded-md shadow transition-transform active:scale-95`} disabled={isSolving}>
                                    🔄 Reset
                                </button>
                                <div className="pt-2 border-t border-gray-200 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                        <input type="checkbox" checked={allowInvalidMoves} onChange={() => setAllowInvalidMoves(!allowInvalidMoves)} className="accent-purple-600 rounded" />
                                        Practice Mode
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/50">
                            <h3 className={`font-bold ${currentTheme.textHighlight} mb-2`}>Challenge</h3>
                            <p className="text-sm text-gray-600 mb-2">Find all solutions for extra glory!</p>
                            <button onClick={solvePuzzle} className={`w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700`} disabled={isSolving}>
                                {isSolving ? 'Solving...' : '🤖 Watch AI Solve'}
                            </button>
                        </div>
                    </div>

                    {/* Board Area */}
                    <div className="order-1 lg:order-2 flex-grow flex justify-center">
                        <div
                            className={`inline-grid gap-0 shadow-2xl rounded-lg overflow-hidden border-8 ${currentTheme.boardBorder} transition-colors duration-500`}
                            style={{
                                gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                                gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
                                width: 'min(85vw, 600px)',
                                height: 'min(85vw, 600px)',
                            }}
                        >
                            {renderBoard()}
                        </div>
                    </div>

                </div>
            </div>

            {/* Victory Modal */}
            {isVictory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-bounce-slow text-center border-4 border-yellow-400">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Level Completed!</h2>
                        {isNewHighScore && (
                            <div className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold animate-pulse">
                                🌟 NEW HIGH SCORE! 🌟
                            </div>
                        )}
                        <p className="text-gray-600 mb-6">You conquered the {boardSize}x{boardSize} board in {formatTime(elapsedTime)}.</p>

                        <div className="grid gap-3">
                            <button onClick={onBack} className={`${currentTheme.buttonPrimary} w-full py-3 rounded-xl font-bold text-lg shadow-lg`}>
                                🗺️ Return to Map
                            </button>
                            <button onClick={() => { setIsVictory(false); clearBoard(); setIsNewHighScore(false); }} className={`${currentTheme.buttonSecondary} w-full py-3 rounded-xl font-bold`}>
                                🔄 Replay Level
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
