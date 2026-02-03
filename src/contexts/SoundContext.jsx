import React, { createContext, useContext, useState, useCallback } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('nqueens_muted') === 'true';
    });

    const toggleMute = () => {
        setIsMuted(prev => {
            const newVal = !prev;
            localStorage.setItem('nqueens_muted', newVal.toString());
            return newVal;
        });
    };

    const playSound = useCallback((type) => {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case 'place':
                    // Soft "thud" or high ping
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'remove':
                    // Lower pitch removal sound
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'error':
                    // Buzz/Error sound
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;

                case 'victory':
                    // Major arpeggio
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
                    notes.forEach((freq, i) => {
                        const oscV = ctx.createOscillator();
                        const gainV = ctx.createGain();
                        oscV.connect(gainV);
                        gainV.connect(ctx.destination);

                        oscV.type = 'triangle';
                        oscV.frequency.value = freq;

                        const time = now + (i * 0.1);
                        gainV.gain.setValueAtTime(0.2, time);
                        gainV.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

                        oscV.start(time);
                        oscV.stop(time + 0.4);
                    });
                    break;

                case 'click':
                    // Subtle UI click
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, now);
                    gainNode.gain.setValueAtTime(0.05, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;

                default:
                    break;
            }
        } catch (e) {
            console.error("Audio playback error:", e);
        }
    }, [isMuted]);

    return (
        <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
