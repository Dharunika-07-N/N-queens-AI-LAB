# ♛ N Queens Puzzle Game

An interactive, educational N Queens puzzle game built with React and Tailwind CSS. This beautiful web application implements all 35 modules for a complete gaming experience!

![N Queens Game](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Features

### Core Gameplay
- **Interactive Chessboard**: Click to place/remove queens on boards from 4×4 to 12×12
- **Real-time Validation**: Visual feedback for valid and invalid placements
- **Attack Visualization**: Red overlay shows squares under attack
- **Smart Hints**: Get suggestions for safe queen placements
- **Auto Solver**: Watch the backtracking algorithm solve the puzzle step-by-step

### Game Features
- ✅ **Victory Detection**: Automatic celebration when puzzle is solved
- 🎯 **Move Counter**: Track your progress (X/N queens placed)
- ⏱️ **Timer**: See how fast you can solve each puzzle
- ↶↷ **Undo/Redo**: Experiment freely with full history support
- 🎨 **Beautiful Animations**: Smooth transitions and confetti celebrations
- 📱 **Responsive Design**: Works perfectly on mobile and desktop

### Educational Elements
- 📚 **Instructions Panel**: Learn the rules and strategies
- 🔢 **Solution Counter**: See how many solutions exist for each board size
- 🤖 **Algorithm Visualization**: Watch the backtracking algorithm in action
- 🎓 **Practice Mode**: Toggle to allow invalid moves for learning

### UI/UX Excellence
- 🌈 **Modern Design**: Gradient backgrounds and glassmorphism effects
- 🎭 **Classic Chessboard**: Authentic alternating square pattern
- 👑 **Elegant Queens**: Beautiful Unicode queen symbols with shadows
- 🎊 **Victory Celebration**: Confetti animation and congratulations modal
- 📊 **Progress Bar**: Visual indicator of completion percentage

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Dharunika-07-N/N-queens-AI-LAB.git

# Navigate to project directory
cd N-queens

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Module Implementation

All 35 modules have been implemented:

### Foundation (Modules 1-9)
✅ Module 1: Project Setup & Basic Structure  
✅ Module 2: State Management Setup  
✅ Module 3: Board Size Selector UI  
✅ Module 4: Board Size Change Handler  
✅ Module 5: Chess Board Grid Layout  
✅ Module 6: Square Component  
✅ Module 7: Queen Rendering  
✅ Module 8: Click Handler for Queen Placement  
✅ Module 9: Queen Position Data Structure  

### Attack Detection (Modules 10-16)
✅ Module 10: Attack Calculation - Rows  
✅ Module 11: Attack Calculation - Columns  
✅ Module 12: Attack Calculation - Diagonals  
✅ Module 13: Combined Attack Detection  
✅ Module 14: Visual Attack Indicators  
✅ Module 15: Placement Validation  
✅ Module 16: Invalid Placement Feedback  

### Game State (Modules 17-20)
✅ Module 17: Move Counter Display  
✅ Module 18: Clear Board Button  
✅ Module 19: Victory Detection Logic  
✅ Module 20: Victory Celebration UI  

### Solver & Hints (Modules 21-25)
✅ Module 21: Backtracking Solver Algorithm  
✅ Module 22: Solve Button & Solution Display  
✅ Module 23: Animated Solution Steps  
✅ Module 24: Hint System Logic  
✅ Module 25: Hint Button & Visual Indicator  

### Advanced Features (Modules 26-35)
✅ Module 26: Undo Functionality  
✅ Module 27: Redo Functionality  
✅ Module 28: Timer Implementation  
✅ Module 29: Rules/Instructions Panel  
✅ Module 30: Settings Toggle (Allow Invalid Moves)  
✅ Module 31: Progress Indicator Bar  
✅ Module 32: Multiple Solutions Navigator  
✅ Module 33: Solution Counter Display  
✅ Module 34: Responsive Design & Mobile Optimization  
✅ Module 35: Polish & Animations  

## 🎯 How to Play

1. **Select Board Size**: Choose from 4×4 to 12×12
2. **Place Queens**: Click on squares to place queens
3. **Avoid Attacks**: Queens can't attack each other (same row, column, or diagonal)
4. **Win**: Place all N queens without any conflicts!

### Tips
- Use the **Hint** button if you get stuck
- Enable **Practice Mode** to experiment with invalid placements
- Try the **Auto Solve** to see the algorithm in action
- Use **Undo/Redo** to explore different strategies

## 🧮 Solution Counts

| Board Size | Solutions |
|------------|-----------|
| 4×4        | 2         |
| 5×5        | 10        |
| 6×6        | 4         |
| 7×7        | 40        |
| 8×8        | 92        |
| 9×9        | 352       |
| 10×10      | 724       |
| 11×11      | 2,680     |
| 12×12      | 14,200    |

## 🛠️ Technology Stack

- **React 18**: Modern hooks-based architecture
- **Tailwind CSS**: Utility-first styling with custom animations
- **Vite**: Lightning-fast build tool and dev server
- **JavaScript ES6+**: Modern JavaScript features

## 📁 Project Structure

```
N-queens/
├── src/
│   ├── App.jsx          # Main game component (all 35 modules)
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind styles & custom animations
├── public/
├── index.html           # HTML with SEO meta tags
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🎨 Design Philosophy

This application follows modern web design principles:

- **Rich Aesthetics**: Vibrant gradients and smooth animations
- **Visual Excellence**: Premium feel with attention to detail
- **Responsive**: Seamless experience across all devices
- **Accessible**: Proper semantic HTML and keyboard navigation
- **Performance**: Optimized for smooth 60fps animations

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🙏 Acknowledgments

- The N Queens problem is a classic computer science puzzle
- Backtracking algorithm implementation for educational purposes
- Built with modern React best practices

## 📞 Contact

Created by Dharunika - [GitHub](https://github.com/Dharunika-07-N)

---

**Enjoy solving the N Queens puzzle! 👑**
