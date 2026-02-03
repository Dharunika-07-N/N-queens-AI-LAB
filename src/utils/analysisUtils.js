// Worker-friendly analysis logic

export const calculateAllSolutions = (n) => {
    const solutions = [];
    const board = new Array(n).fill(-1); // board[row] = col

    const isSafe = (row, col) => {
        for (let prevRow = 0; prevRow < row; prevRow++) {
            const prevCol = board[prevRow];
            if (prevCol === col || Math.abs(prevCol - col) === Math.abs(prevRow - row)) {
                return false;
            }
        }
        return true;
    };

    const solve = (row) => {
        if (row === n) {
            solutions.push([...board]); // Copy valid config
            return;
        }

        for (let col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board[row] = col;
                solve(row + 1);
            }
        }
    };

    solve(0);
    return solutions;
};

export const generateHeatmapData = (n, solutions) => {
    // Initialize N x N grid with 0s
    const heatmap = Array.from({ length: n }, () => Array(n).fill(0));

    solutions.forEach(sol => {
        sol.forEach((col, row) => {
            heatmap[row][col]++;
        });
    });

    // Normalize to 0-1 range for opacity
    const maxFreq = Math.max(...heatmap.flat());

    return {
        grid: heatmap,
        maxFreq,
        totalSolutions: solutions.length
    };
};

export const getDifficultyRating = (n) => {
    // Subjective difficulty based on solution density
    // N=8: 92 solutions / 4B possibilities
    const ratings = {
        4: "Tutorial",
        5: "Novice",
        6: "Easy",
        7: "Medium",
        8: "Hard (Classic)",
        9: "Expert",
        10: "Master",
        11: "Grandmaster",
        12: "Supercomputer"
    };
    return ratings[n] || "Unknown";
};
