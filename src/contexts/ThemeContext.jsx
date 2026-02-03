import React, { createContext, useContext, useState } from 'react';

const themes = {
    classic: {
        id: 'classic',
        name: 'Classic Wood',
        background: 'bg-amber-50',
        boardBorder: 'border-amber-900',
        squareLight: 'bg-amber-200',
        squareDark: 'bg-amber-800',
        textHighlight: 'text-amber-900',
        accent: 'bg-amber-700',
        buttonPrimary: 'bg-amber-700 hover:bg-amber-800 text-white',
        buttonSecondary: 'border-2 border-amber-700 text-amber-900 hover:bg-amber-100',
        queenLight: '#78350f', // amber-900
        queenDark: '#fef3c7', // amber-100
        gradientTitle: 'from-amber-600 via-orange-500 to-yellow-600',
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Breeze',
        background: 'bg-cyan-50',
        boardBorder: 'border-cyan-900',
        squareLight: 'bg-cyan-200',
        squareDark: 'bg-cyan-700',
        textHighlight: 'text-cyan-900',
        accent: 'bg-cyan-600',
        buttonPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
        buttonSecondary: 'border-2 border-cyan-600 text-cyan-900 hover:bg-cyan-100',
        queenLight: '#0e7490', // cyan-700
        queenDark: '#cffafe', // cyan-100
        gradientTitle: 'from-cyan-600 via-blue-500 to-teal-400',
    },
    neon: {
        id: 'neon',
        name: 'Cyber Neon',
        background: 'bg-slate-900',
        boardBorder: 'border-fuchsia-500',
        squareLight: 'bg-slate-800',
        squareDark: 'bg-fuchsia-900',
        textHighlight: 'text-fuchsia-400',
        accent: 'bg-fuchsia-600',
        buttonPrimary: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
        buttonSecondary: 'border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-slate-800',
        queenLight: '#e879f9', // fuchsia-400
        queenDark: '#0f172a', // slate-900
        gradientTitle: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    },
    nature: {
        id: 'nature',
        name: 'Forest Glade',
        background: 'bg-green-50',
        boardBorder: 'border-green-900',
        squareLight: 'bg-green-200',
        squareDark: 'bg-emerald-800',
        textHighlight: 'text-emerald-900',
        accent: 'bg-emerald-700',
        buttonPrimary: 'bg-emerald-700 hover:bg-emerald-800 text-white',
        buttonSecondary: 'border-2 border-emerald-700 text-emerald-900 hover:bg-emerald-100',
        queenLight: '#064e3b', // emerald-900
        queenDark: '#d1fae5', // emerald-100
        gradientTitle: 'from-green-600 via-emerald-500 to-lime-500',
    },
    royal: {
        id: 'royal',
        name: 'Royal Purple',
        background: 'bg-purple-50',
        boardBorder: 'border-purple-900',
        squareLight: 'bg-purple-200',
        squareDark: 'bg-purple-800',
        textHighlight: 'text-purple-900',
        accent: 'bg-purple-700',
        buttonPrimary: 'bg-purple-700 hover:bg-purple-800 text-white',
        buttonSecondary: 'border-2 border-purple-700 text-purple-900 hover:bg-purple-100',
        queenLight: '#4c1d95', // purple-900
        queenDark: '#fae8ff', // purple-100
        gradientTitle: 'from-purple-600 via-pink-600 to-red-500',
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(themes.classic);

    const switchTheme = (themeId) => {
        if (themes[themeId]) {
            setCurrentTheme(themes[themeId]);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, switchTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
