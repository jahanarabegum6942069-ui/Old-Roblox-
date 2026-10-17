import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { ShieldAlert, Terminal, Lock, CheckCircle2 } from 'lucide-react';

interface LogPanelWidgetProps {
  onNameLock: (lockedName: string) => void;
}

export const LogPanelWidget: React.FC<LogPanelWidgetProps> = ({ onNameLock }) => {
  const [logs, setLogs] = useState<string[]>([
    'System initialized: BloxHub Guest Terminal v2.6',
    'AI Scanner active: Monitoring player positions...',
  ]);
  const [playerPos, setPlayerPos] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('SWITCH TO 666');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('Guest 666');
  const [nameColor, setNameColor] = useState<string>('text-amber-300');
  const logEndRef = useRef<HTMLDivElement>(null);

  // REMOVE "Guest" FROM NAME - JUST 666
  const cleanName = (name: string): string => {
    let newName = name.replace(/Guest/g, '').trim();
    return newName || '666';
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const lockTo666 = () => {
    sound.playOof();
    setIsLocked(true);
    let finalName = cleanName('Guest 666'); // becomes "666"
    setDisplayName(`${finalName} 🔒 LOCKED`);
    setNameColor('text-red-500 font-black');
    setButtonDisabled(true);
    setButtonText('LOCKED TO 666 - YES THERE IT IS');
    addLog('AI DETECTED 666! LOCKING PLAYER NAME TO 666!');
    onNameLock('666 🔒 LOCKED');
  };

  const onPlayerMove = (newPos: number) => {
    setPlayerPos(newPos);
    addLog(`Player moved to position: ${newPos}`);
    
    if (newPos === 666 || newPos.toString().includes('666')) {
      lockTo666();
    }
  };

  const handleSwitchButtonClick = () => {
    sound.playClick();
    onPlayerMove(666);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 rounded-2xl border-2 border-red-600/80 p-4 text-white shadow-2xl max-w-md w-full mx-auto my-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
            AI Terminal Log Panel
          </span>
        </div>
        <div id="playerName" className={`text-xs ${nameColor} bg-slate-900 px-2 py-1 rounded border border-slate-800`}>
          {displayName}
        </div>
      </div>

      {/* Log Feed Container */}
      <div 
        id="log" 
        className="h-32 bg-slate-900/90 rounded-xl p-3 border border-slate-800 overflow-y-auto text-[11px] space-y-1.5 text-slate-300 font-mono shadow-inner"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="leading-relaxed opacity-90">
            <span className="text-red-400">&gt;</span> {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Button placed INSIDE log panel as requested */}
      <div className="mt-3.5 flex justify-center">
        <button
          id="playerTypeSelector"
          disabled={buttonDisabled}
          onClick={handleSwitchButtonClick}
          style={{
            background: buttonDisabled ? '#475569' : 'red',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '13px',
            width: '100%',
            cursor: buttonDisabled ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s ease',
          }}
          className="hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
        >
          {buttonDisabled ? <Lock className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};
