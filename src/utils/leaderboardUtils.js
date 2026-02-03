// Utility to manage local leaderboards (Module 36)

const STORAGE_KEY = 'nqueens_leaderboard';

export const getLeaderboard = (boardSize) => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return data[boardSize] || [];
    } catch (e) {
        return [];
    }
};

export const saveScore = (boardSize, timeMs, moves, date = new Date().toISOString()) => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const boardScores = data[boardSize] || [];

        const newScore = {
            id: Date.now().toString(),
            timeMs,
            moves,
            date,
        };

        boardScores.push(newScore);

        // Sort by time (ascending) and keep top 10
        boardScores.sort((a, b) => a.timeMs - b.timeMs);
        const topScores = boardScores.slice(0, 10);

        data[boardSize] = topScores;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        // Check if this is a new high score (rank 1)
        return topScores[0].id === newScore.id;
    } catch (e) {
        console.error("Failed to save score", e);
        return false;
    }
};

export const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10); // 2 digits
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
};
