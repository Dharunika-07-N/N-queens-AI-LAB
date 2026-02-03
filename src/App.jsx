import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LevelMap from './components/LevelMap';
import Game from './components/Game';
import './index.css';

const App = () => {
  const [view, setView] = useState('map'); // 'map', 'game'
  const [currentLevel, setCurrentLevel] = useState(4);
  const [unlockedMaxLevel, setUnlockedMaxLevel] = useState(() => {
    const saved = localStorage.getItem('nqueens_unlocked_level');
    return saved ? parseInt(saved, 10) : 4;
  });

  useEffect(() => {
    localStorage.setItem('nqueens_unlocked_level', unlockedMaxLevel.toString());
  }, [unlockedMaxLevel]);

  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setView('game');
  };

  const handleBackToMap = () => {
    setView('map');
  };

  const handleLevelComplete = (level, timeMs) => {
    // Only unlock if we completed the current max level
    if (level === unlockedMaxLevel && level < 12) {
      setUnlockedMaxLevel(prev => prev + 1);
    }
  };

  return (
    <ThemeProvider>
      <div className="font-sans transition-colors duration-500">
        {view === 'map' ? (
          <LevelMap
            unlockedMaxLevel={unlockedMaxLevel}
            onSelectLevel={handleLevelSelect}
          />
        ) : (
          <Game
            level={currentLevel}
            onBack={handleBackToMap}
            onComplete={handleLevelComplete}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
