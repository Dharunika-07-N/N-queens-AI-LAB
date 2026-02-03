import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LevelMap = ({ unlockedMaxLevel, onSelectLevel, onBack }) => {
    const { currentTheme, switchTheme, themes } = useTheme();

    const levels = Array.from({ length: 9 }, (_, i) => i + 4); // 4 to 12

    return (
        <div className={`min-h-screen ${currentTheme.background} transition-colors duration-500 flex flex-col items-center py-12 px-4`}>

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-white transition-all hover:scale-105 flex items-center gap-2"
                >
                    ← Menu
                </button>
            )}

            <h1 className={`text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r ${currentTheme.gradientTitle} bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-500 cursor-default select-none`}>
                N-QUEENS
            </h1>
            <p className={`${currentTheme.textHighlight} text-xl md:text-2xl mb-12 font-medium tracking-widest uppercase`}>Master the Grid</p>

            {/* Theme Switcher */}
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl mb-16 flex gap-4 border border-white/50 animate-fade-in-up">
                {Object.values(themes).map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => switchTheme(theme.id)}
                        className={`
                 w-12 h-12 rounded-full border-2 border-white/50 shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95
                 bg-gradient-to-br ${theme.gradientTitle}
                 ${currentTheme.id === theme.id ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : 'opacity-80 hover:opacity-100'}
               `}
                        title={theme.name}
                    />
                ))}
            </div>

            {/* Map Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl w-full px-4">
                {levels.map((levelSize, index) => {
                    const isUnlocked = levelSize <= unlockedMaxLevel;
                    const isCompleted = levelSize < unlockedMaxLevel;
                    const levelNum = index + 1;

                    // Dynamic border color based on theme
                    const borderColorClass = isUnlocked
                        ? currentTheme.boardBorder.replace('border-', 'border-b-') // Hacky but works for tailwind colors like border-amber-900 -> border-b-amber-900
                        : 'border-b-gray-400';

                    // Actually border-b-amber-900 is valid if border-amber-900 is. But wait, `border-amber-900` is a class. 
                    // `border-b-amber-900` needs to be constructed. 
                    // Let's just use inline style or a generic dark border for bottom.
                    // Or simpler: just use the theme text color for the border bottom or a standard class.
                    // I'll stick to a safe approach: use `currentTheme.accent` for text/bg.

                    return (
                        <button
                            key={levelSize}
                            onClick={() => isUnlocked && onSelectLevel(levelSize)}
                            disabled={!isUnlocked}
                            className={`
                    relative group rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300
                    h-64
                    ${isUnlocked
                                    ? `bg-white cursor-pointer hover:-translate-y-2 hover:shadow-2xl active:translate-y-0 active:shadow-md ${currentTheme.textHighlight}`
                                    : 'bg-gray-100 cursor-not-allowed opacity-60 text-gray-400'}
                    shadow-xl border-2 border-transparent
                    ${isUnlocked ? 'hover:border-current' : ''}
                 `}
                        >
                            <div className={`text-6xl mb-2 transition-transform duration-300 group-hover:scale-110 ${isUnlocked ? '' : 'filter grayscale blur-[1px]'}`}>
                                {isCompleted ? '👑' : (isUnlocked ? (levelSize > 9 ? '🐉' : '⚔️') : '🔒')}
                            </div>
                            <div className="text-center z-10">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Level {levelNum}</div>
                                <div className="text-4xl font-black">{levelSize} × {levelSize}</div>
                            </div>

                            {isUnlocked && (
                                <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${currentTheme.gradientTitle} rounded-b-2xl opacity-80`} />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelMap;
