export const CAMPAIGN_LEVELS = [
    { id: 1, boardSize: 4, difficulty: 'easy', title: "The Beginning", description: "Learn the basics on a small board." },
    { id: 2, boardSize: 5, difficulty: 'easy', title: "Space to Breathe", description: "A slightly larger kingdom." },
    { id: 3, boardSize: 5, difficulty: 'medium', title: "Training Wheels Off", description: "Standard rules apply." },
    { id: 4, boardSize: 6, difficulty: 'medium', title: "Sixfold Path", description: "Things are getting interesting." },
    { id: 5, boardSize: 7, difficulty: 'medium', title: "Lucky Seven", description: "Find your rhythm." },
    { id: 6, boardSize: 8, difficulty: 'medium', title: "Classic Challenge", description: "The original puzzle." },
    { id: 7, boardSize: 8, difficulty: 'hard', title: "The Gauntlet", description: "No hints allowed. Prove your skill." },
    { id: 8, boardSize: 9, difficulty: 'hard', title: "Crowded House", description: "Tougher board, tougher rules." },
    { id: 9, boardSize: 10, difficulty: 'hard', title: "Decagon", description: "A massive challenge." },
    { id: 10, boardSize: 8, difficulty: 'expert', title: "Blind Justice", description: "Invisible queens on a classic board." },
    { id: 11, boardSize: 10, difficulty: 'expert', title: "Memory Master", description: "Can you remember where they are?" },
    { id: 12, boardSize: 12, difficulty: 'expert', title: "The Grandmaster", description: "The ultimate test of mind and memory." }
];

const CAMPAIGN_STORAGE_KEY = 'nqueens_campaign_progress';

export const getCampaignProgress = () => {
    try {
        const saved = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
        return saved ? parseInt(saved, 10) : 1;
    } catch (error) {
        return 1;
    }
};

export const saveCampaignProgress = (levelId) => {
    try {
        const current = getCampaignProgress();
        if (levelId === current && levelId < CAMPAIGN_LEVELS.length) {
            localStorage.setItem(CAMPAIGN_STORAGE_KEY, (levelId + 1).toString());
            return true; // Leveled up
        }
        return false;
    } catch (error) {
        console.error("Failed to save campaign", error);
        return false;
    }
};
