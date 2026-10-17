import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export const SixSixtySixArena: React.FC<{onExit: () => void, level?: number}> = ({ onExit, level = 1 }) => {
  const goal = 55 * level;
  const time = Math.max(10, 55 - (level - 1) * 5);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && active && clicks < goal) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (clicks >= goal || timeLeft === 0) {
      setActive(false);
    }
  }, [timeLeft, active, clicks, goal]);

  const handleClick = () => {
    if (active) {
      setClicks(prev => prev + 1);
      sound.playClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[1000] p-6 text-center text-white">
      <h1 className="text-4xl font-black text-red-600 mb-8">{localStorage.getItem('arena_title') || `ez 666 ARENA ${level}`}</h1>
      <div className="text-6xl font-black mb-4 text-red-500">{clicks} / {goal}</div>
      <div className="text-2xl mb-8 font-mono">{timeLeft}s remaining</div>
      
      {!active ? (
        <div className="text-3xl font-bold mb-8">
            {clicks >= goal ? <span className="text-green-500">YOU ASCENDED</span> : <span className="text-red-500">YOU FAILED</span>}
        </div>
      ) : (
        <button 
            onClick={handleClick}
            className="w-48 h-48 bg-red-900 rounded-full font-black text-2xl shadow-2xl shadow-red-950 hover:bg-red-800 transition-all border-4 border-red-700"
        >
            CLICK
        </button>
      )}
      
      <button onClick={onExit} className="mt-8 px-6 py-3 bg-white text-black rounded-lg font-bold">Exit Arena</button>
    </div>
  );
};
