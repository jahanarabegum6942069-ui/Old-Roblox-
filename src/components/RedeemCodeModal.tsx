import React, { useState } from 'react';
import { X } from 'lucide-react';
import { sound } from '../utils/audio';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleRedeem = () => {
    const upperCode = code.trim().toUpperCase();
    if (upperCode === "ROBLOXW666") {
      localStorage.setItem('arena_title', 'ez 666 ARENA.6');
      setMessage("SUCCESS: Arena Title Set to .6");
      sound.playClick();
    } else if (upperCode === "666") {
      localStorage.setItem('arena_title', 'ez 666 ARENA.7');
      setMessage("SUCCESS: Arena Title Set to .7");
      sound.playClick();
    } else if (upperCode === "67") {
      setMessage("SUCCESS: Code 67 Validated");
      sound.playClick();
    } else {
      setMessage("Invalid Code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-red-900 rounded-2xl p-6 w-full max-w-sm text-center">
        <button onClick={onClose} className="float-right text-slate-500 hover:text-white"><X /></button>
        <h2 className="text-xl font-black text-white mb-4">REDEEM CODE</h2>
        <input 
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full p-3 bg-black border border-slate-700 rounded-lg text-white text-center mb-4"
        />
        <button onClick={handleRedeem} className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">REDEEM</button>
        {message && <p className="mt-4 text-sm font-bold text-red-500">{message}</p>}
      </div>
    </div>
  );
};
