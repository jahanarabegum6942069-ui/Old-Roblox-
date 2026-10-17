import React, { useState } from 'react';
import { SixSixtySixArena } from './SixSixtySixArena';

export const BloxHubArenaWidget: React.FC = () => {
  const [taps, setTaps] = useState(0);
  const [everythingTaps, setEverythingTaps] = useState(0);
  const [found666, setFound666] = useState(0);
  const [isRMode, setIsRMode] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'finding666' | 'final' | 'arena'>('idle');
  const [arenaLevel, setArenaLevel] = useState(1);
  const [hidden666s, setHidden666s] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState('Guest 666');
  const [code, setCode] = useState('');
  
  const tapLogo = () => {
    const newTaps = taps + 1;
    setTaps(newTaps);
    if (newTaps >= 6) {
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setTaps(0), 2000);
    }
  };

  const tapName = () => {
    setPlayerName('Player');
    setTimeout(() => { if (!isRMode) setPlayerName('Guest 666'); }, 2000);
  };

  const tapEverything = () => {
    setEverythingTaps(prev => prev + 1);
    if (everythingTaps + 1 > 3) {
      setIsRMode(true);
      setGameState('final');
    }
  };

  const spawn666s = (place: string) => {
    setGameState('finding666');
    setFound666(0);
    setHidden666s(Array.from({ length: 12 }, (_, i) => i));
  };

  const handle666Click = (id: number) => {
    setHidden666s(prev => prev.filter(i => i !== id));
    const newFound = found666 + 1;
    setFound666(newFound);
    if (newFound >= 10) triggerFinal();
  };

  const triggerFinal = () => {
    setIsRMode(true);
    setGameState('final');
    if (navigator.vibrate) navigator.vibrate([300,100,300,100,500]);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().trim();
    setCode(val);
    if (val === "R666" || val === "R6666") {
        triggerFinal();
    }
  };

  const startArena = (level: number) => {
      setArenaLevel(level);
      setGameState('arena');
  };

  if (gameState === 'arena') {
      return <SixSixtySixArena onExit={() => setGameState('idle')} level={arenaLevel} />;
  }

  if (gameState === 'final') {
      return (
        <div className="bg-black text-red-500 h-[60vh] flex justify-center items-center flex-col p-4 rounded-2xl border border-red-900">
          <h1 className="text-5xl tracking-[10px]">R</h1>
          <h1 className="text-2xl font-bold">ROBLOX X PART NIGHT</h1>
          <p className="mt-2">Every block turned into R</p>
          <button onClick={() => window.location.reload()} className="mt-5 px-6 py-3 bg-white text-black rounded-lg font-bold">Restart</button>
        </div>
      );
  }

  return (
    <div className="bg-[#0a0a0a] text-white p-6 rounded-2xl min-h-[60vh] flex flex-col items-center justify-center font-mono text-center">
        {gameState === 'idle' && (
            <>
                <div onClick={tapLogo} className={`p-5 text-3xl font-black tracking-widest cursor-pointer ${taps >= 6 ? 'text-red-500' : ''}`}>
                    {taps >= 6 ? <span className="bg-white px-4 py-1">666</span> : 'BLOXHUB'}
                </div>
                <div onClick={tapName} className="opacity-60 cursor-pointer text-lg">{playerName}</div>
                
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[1,2,3,4,5,6,7].map(level => (
                        <button 
                            key={level}
                            onClick={() => startArena(level)}
                            className="px-4 py-2 bg-red-900 border border-red-700 text-white font-black rounded-lg hover:bg-red-800 uppercase tracking-widest"
                        >
                            ez {level}
                        </button>
                    ))}
                </div>

                <div onClick={tapEverything} className="text-[80px] mt-10 cursor-pointer">
                    {taps >= 6 ? <span className="text-red-500">666</span> : '🧱'}
                </div>
                <div className="mt-4 text-sm opacity-70">
                    {taps >= 6 ? 'Guest 666' : 'Tap everything'}
                </div>
                <input
                    type="text"
                    placeholder="Enter secret code"
                    value={code}
                    onChange={handleCodeChange}
                    className="mt-8 p-3 bg-[#111] border border-slate-700 text-white rounded-lg text-center w-[200px]"
                />
                <div className="text-[12px] opacity-30 mt-2">Hint: R + 666</div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button onClick={() => spawn666s("Animal Hospital")} className="px-4 py-2 border border-slate-700 bg-[#111] rounded-lg">Hospital 🏥</button>
                    <button onClick={() => spawn666s("Battle Bus")} className="px-4 py-2 border border-slate-700 bg-[#111] rounded-lg">Battle Bus 🚌</button>
                </div>
            </>
        )}
        
        {gameState === 'finding666' && (
            <div className="relative w-full h-[50vh] border border-dashed border-red-900 mt-5">
                <div className="p-2 text-sm text-red-500">Found {found666}/10 666s</div>
                {hidden666s.map(id => (
                    <div
                        key={id}
                        className="absolute text-red-500 font-bold text-xl cursor-pointer opacity-70"
                        style={{left: `${Math.random()*80}%`, top: `${Math.random()*80}%`}}
                        onClick={() => handle666Click(id)}
                    >
                        666
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
