import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';

/**
 * N Queens Puzzle Game - Complete Interactive Application
 * Implements all 35 modules in a single comprehensive component
 */

const NQueensGame = () => {
  // ============================================================================
  // MODULE 2: State Management Setup
  // ============================================================================

  // Board configuration
  const [boardSize, setBoardSize] = useState(8);
  const [queens, setQueens] = useState(new Set());

  // Game state
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [allowInvalidMoves, setAllowInvalidMoves] = useState(false);

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

  // ============================================================================
  // MODULE 10-13: Attack Calculation Functions
  // ============================================================================

  /**
   * Check if a position is under attack by any placed queen
   * Combines row, column, and diagonal attack detection
   */
  const isUnderAttack = useCallback((row, col, currentQueens = queens) => {
    for (const pos of currentQueens) {
      const [qRow, qCol] = pos.split(',').map(Number);

      // Same row (Module 10)
      if (qRow === row) return true;

      // Same column (Module 11)
      if (qCol === col) return true;

      // Diagonal attacks (Module 12)
      if (Math.abs(qRow - row) === Math.abs(qCol - col)) return true;
    }

    return false;
  }, [queens]);

  /**
   * Get all squares currently under attack
   */
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

  // ============================================================================
  // MODULE 19: Victory Detection Logic
  // ============================================================================

  useEffect(() => {
    if (queens.size === boardSize && queens.size > 0) {
      // Check if all queens are placed without attacking each other
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
      }
    } else {
      setIsVictory(false);
    }
  }, [queens, boardSize, isUnderAttack, isVictory]);

  // ============================================================================
  // MODULE 28: Timer Implementation
  // ============================================================================

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

  // ============================================================================
  // MODULE 8: Click Handler for Queen Placement
  // ============================================================================

  const handleSquareClick = (row, col) => {
    if (isSolving) return;

    const position = `${row},${col}`;
    const newQueens = new Set(queens);

    // Start timer on first move
    if (queens.size === 0 && !newQueens.has(position)) {
      startTimer();
    }

    if (newQueens.has(position)) {
      // Remove queen
      newQueens.delete(position);
      setQueens(newQueens);
      setMoveCount(moveCount - 1);

      // Add to history
      addToHistory(newQueens);
    } else {
      // Check if placement is valid
      if (!allowInvalidMoves && isUnderAttack(row, col)) {
        // Invalid placement feedback (Module 16)
        setInvalidSquare(position);
        setTimeout(() => setInvalidSquare(null), 500);
        return;
      }

      // Place queen
      newQueens.add(position);
      setQueens(newQueens);
      setMoveCount(moveCount + 1);

      // Clear hint if any
      setHintPosition(null);

      // Add to history
      addToHistory(newQueens);
    }
  };

  // ============================================================================
  // MODULE 26-27: Undo/Redo Functionality
  // ============================================================================

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

  // ============================================================================
  // MODULE 18: Clear Board Function
  // ============================================================================

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

  // ============================================================================
  // MODULE 4: Board Size Change Handler
  // ============================================================================

  const handleBoardSizeChange = (newSize) => {
    setBoardSize(newSize);
    clearBoard();
  };

  // ============================================================================
  // MODULE 21: Backtracking Solver Algorithm
  // ============================================================================

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

  // ============================================================================
  // MODULE 22-23: Solve Button & Animated Solution
  // ============================================================================

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

      // Animate placement
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

  // ============================================================================
  // MODULE 24-25: Hint System
  // ============================================================================

  const showHint = () => {
    // Find the first safe position
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

  // ============================================================================
  // MODULE 20: Victory Celebration
  // ============================================================================

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

  // ============================================================================
  // MODULE 33: Solution Counter
  // ============================================================================

  const solutionCounts = {
    4: 2, 5: 10, 6: 4, 7: 40, 8: 92, 9: 352, 10: 724, 11: 2680, 12: 14200
  };

  // ============================================================================
  // MODULE 5-7: Board Rendering
  // ============================================================================

  const renderBoard = () => {
    const board = [];

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const position = `${row},${col}`;
        const hasQueen = queens.has(position);
        const isAttacked = getAttackedSquares.has(position) && !hasQueen;
        const isHint = hintPosition === position;
        const isInvalid = invalidSquare === position;

        // Determine square color (classic chessboard pattern)
        const isLight = (row + col) % 2 === 0;
        const baseColor = isLight ? 'bg-amber-100' : 'bg-amber-700';

        board.push(
          <div
            key={position}
            onClick={() => handleSquareClick(row, col)}
            className={`
              square ${baseColor}
              ${isAttacked ? 'attacked-square' : ''}
              ${isHint ? 'hint-square' : ''}
              ${isInvalid ? 'invalid-placement' : ''}
              ${hasQueen ? 'bg-opacity-90' : ''}
            `}
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
            }}
          >
            {hasQueen && (
              <span className="queen select-none" style={{
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                color: isLight ? '#7c2d12' : '#fef3c7'
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

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Confetti Animation */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className={`confetti-piece ${piece.color}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            ♛ N Queens Puzzle ♛
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
            Place {boardSize} queens on the board so that no queen can attack another!
          </p>
        </div>

        {/* MODULE 29: Instructions Panel */}
        {showInstructions && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 max-w-3xl mx-auto border-2 border-purple-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-purple-600">📚 How to Play</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>• Click on any square to place or remove a queen</p>
              <p>• Queens attack horizontally, vertically, and diagonally</p>
              <p>• Place all {boardSize} queens without any attacking each other</p>
              <p>• Red squares show attacked positions</p>
              <p>• Use hints if you get stuck!</p>
              <p className="text-sm text-purple-600 font-semibold mt-4">
                💡 There are {solutionCounts[boardSize] || '?'} possible solutions for {boardSize}×{boardSize}
              </p>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MODULE 3: Board Size Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Board Size
              </label>
              <select
                value={boardSize}
                onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                disabled={isSolving}
              >
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(size => (
                  <option key={size} value={size}>{size} × {size}</option>
                ))}
              </select>
            </div>

            {/* MODULE 17: Move Counter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Progress
              </label>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
                <span className="text-lg font-bold text-purple-700">
                  {queens.size} / {boardSize} Queens
                </span>
              </div>
            </div>

            {/* Timer Display */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time
              </label>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-2 border-blue-300">
                <span className="text-lg font-bold text-blue-700">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>

            {/* MODULE 30: Settings Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Practice Mode
              </label>
              <button
                onClick={() => setAllowInvalidMoves(!allowInvalidMoves)}
                className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${allowInvalidMoves
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
              >
                {allowInvalidMoves ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* MODULE 31: Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(queens.size / boardSize) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button onClick={showHint} className="btn-primary" disabled={isSolving || isVictory}>
            💡 Hint
          </button>

          <button onClick={solvePuzzle} className="btn-primary" disabled={isSolving}>
            {isSolving ? '⏳ Solving...' : '🤖 Auto Solve'}
          </button>

          <button onClick={clearBoard} className="btn-secondary" disabled={isSolving}>
            🔄 Clear Board
          </button>

          <button onClick={undo} className="btn-secondary" disabled={historyIndex <= 0 || isSolving}>
            ↶ Undo
          </button>

          <button onClick={redo} className="btn-secondary" disabled={historyIndex >= history.length - 1 || isSolving}>
            ↷ Redo
          </button>

          {!showInstructions && (
            <button onClick={() => setShowInstructions(true)} className="btn-secondary">
              ❓ Help
            </button>
          )}
        </div>

        {/* Chess Board */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-grid gap-0 shadow-2xl rounded-lg overflow-hidden border-4 border-amber-900"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
              maxWidth: '90vmin',
              maxHeight: '90vmin',
              width: '100%',
              aspectRatio: '1',
            }}
          >
            {renderBoard()}
          </div>
        </div>

        {/* Victory Modal */}
        {isVictory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform animate-bounce-slow">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Congratulations!
                </h2>
                <p className="text-xl text-gray-700 mb-2">
                  You solved the {boardSize}×{boardSize} puzzle!
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Time: {formatTime(elapsedTime)}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsVictory(false);
                      clearBoard();
                    }}
                    className="btn-primary w-full"
                  >
                    🎮 Play Again
                  </button>
                  <button
                    onClick={() => {
                      setIsVictory(false);
                      handleBoardSizeChange(Math.min(boardSize + 1, 12));
                    }}
                    className="btn-secondary w-full"
                  >
                    ⬆️ Next Level ({Math.min(boardSize + 1, 12)}×{Math.min(boardSize + 1, 12)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center text-gray-600 mt-8">
          <p className="text-sm">
            The N Queens puzzle is a classic computer science problem.
            <br />
            Can you find all {solutionCounts[boardSize] || '?'} solutions for {boardSize}×{boardSize}?
          </p>
        </div>
      </div>
    </div>
  );
};

export default NQueensGame;
