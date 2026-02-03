import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import LevelMap from './components/LevelMap';
import Game from './components/Game';
import CampaignMap from './components/CampaignMap';
import './index.css';

const App = () => {
  const [view, setView] = useState('menu'); // 'menu', 'map', 'campaign', 'game'
  const [gameConfig, setGameConfig] = useState(null); // { level, mode, campaignLevelId, difficulty }

  const [unlockedMaxLevel, setUnlockedMaxLevel] = useState(() => {
    const saved = localStorage.getItem('nqueens_unlocked_level');
    return saved ? parseInt(saved, 10) : 4;
  });

  useEffect(() => {
    localStorage.setItem('nqueens_unlocked_level', unlockedMaxLevel.toString());
  }, [unlockedMaxLevel]);

  // View Navigation
  const goToMenu = () => setView('menu');
  const goToLevelMap = () => setView('map');
  const goToCampaign = () => setView('campaign');

  const startClassicGame = (level) => {
    setGameConfig({ level, mode: 'classic', initialDifficulty: 'medium' });
    setView('game');
  };

  const startCampaignLevel = (levelConfig) => {
    setGameConfig({
      level: levelConfig.boardSize,
      mode: 'campaign',
      campaignLevelId: levelConfig.id,
      initialDifficulty: levelConfig.difficulty
    });
    setView('game');
  };

  const handleLevelComplete = (boardSize, timeMs, campaignSuccess) => {
    if (gameConfig.mode === 'classic') {
      // Only unlock in classic mode progression
      if (boardSize === unlockedMaxLevel && boardSize < 12) {
        setUnlockedMaxLevel(prev => prev + 1);
      }
    } else if (gameConfig.mode === 'campaign' && campaignSuccess) {
      // Campaign progress is handled by Game.jsx calling saveCampaignProgress
      // We can show a toast or auto-navigate here if needed
    }
  };

  const MainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg tracking-tight">N-Queens</h1>
        <p className="text-purple-200 text-lg mb-8 font-light">The Royal Puzzle Game</p>

        <div className="space-y-4">
          <button onClick={goToLevelMap} className="w-full bg-white text-purple-900 hover:bg-purple-50 py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-3">
            <span>🗺️</span> Classic Mode
          </button>
          <button onClick={goToCampaign} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-3">
            <span>⚔️</span> Campaign Journey
          </button>
        </div>

        <div className="mt-8 text-xs text-purple-300 opacity-60">
          v1.0 • Built with React & Tailwind
        </div>
      </div>
    </div>
  );

  return (
    <ThemeProvider>
      <SoundProvider>
        <div className="font-sans transition-colors duration-500">
          {view === 'menu' && <MainMenu />}

          {view === 'map' && (
            <LevelMap
              unlockedMaxLevel={unlockedMaxLevel}
              onSelectLevel={startClassicGame}
              onBack={goToMenu}
            />
          )}

          {view === 'campaign' && (
            <CampaignMap
              onSelectLevel={startCampaignLevel}
              onBack={goToMenu}
            />
          )}

          {view === 'game' && gameConfig && (
            <Game
              level={gameConfig.level}
              mode={gameConfig.mode}
              campaignLevelId={gameConfig.campaignLevelId}
              initialDifficulty={gameConfig.initialDifficulty}
              onBack={() => {
                if (gameConfig.mode === 'campaign') goToCampaign();
                else goToLevelMap();
              }}
              onComplete={handleLevelComplete}
            />
          )}
        </div>
      </SoundProvider>
    </ThemeProvider>
  );
};

export default App;
