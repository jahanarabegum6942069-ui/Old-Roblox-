import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';

interface Friend {
  id: number;
  emoji: string;
  left: number;
  top: number;
  stepped: boolean;
}

interface FriendTrackGameProps {
  onTriggerFinal: () => void;
  subType: string;
}

export const FriendTrackGame: React.FC<FriendTrackGameProps> = ({ onTriggerFinal, subType }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [active, setActive] = useState(false);
  const [steppedCount, setSteppedCount] = useState(0);

  const dropFriends = () => {
    setActive(true);
    setSteppedCount(0);
    const emojiList = ["🧑🤝🧑","👤","👥","🧒","👦","👧","🧑","👨","👩"];
    const newFriends = emojiList.map((f, i) => ({
      id: i,
      emoji: f,
      left: i * 11,
      top: -50,
      stepped: false,
    }));
    setFriends(newFriends);
    
    // Fall animation simulation
    newFriends.forEach((f, i) => {
      setTimeout(() => {
        setFriends(prev => prev.map(p => p.id === f.id ? { ...p, top: Math.random() * 100 + 20 } : p));
      }, 200 + i * 100);
    });
  };

  const stepFriend = (id: number) => {
    if (friends.find(f => f.id === id)?.stepped) return;
    
    setFriends(prev => prev.map(p => p.id === id ? { ...p, stepped: true, emoji: '🧱' } : p));
    setSteppedCount(prev => prev + 1);
    sound.playClick();
    
    if (steppedCount + 1 >= friends.length) {
      onTriggerFinal();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={dropFriends} className="w-[90%] max-w-[380px] bg-[#222] text-white my-4 p-4 border border-[#444] rounded-xl font-bold">
        STEP BUTTON - DROP FRIEND LIST ON TRACK
      </button>

      {active && (
        <div className="relative w-[360px] h-[180px] bg-[#050505] border border-[#222] m-2 rounded-lg overflow-hidden">
          {friends.map(f => (
            <div
              key={f.id}
              className={`absolute text-2xl cursor-pointer transition-all ${f.stepped ? 'text-red-500' : ''}`}
              style={{ left: `${f.left}%`, top: `${f.top}px` }}
              onClick={() => stepFriend(f.id)}
            >
              {f.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
