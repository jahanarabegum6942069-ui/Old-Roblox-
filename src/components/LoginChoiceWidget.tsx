import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { ShieldCheck, AlertTriangle, Skull, RefreshCw, Sparkles, Crown } from 'lucide-react';

interface LoginChoiceWidgetProps {
  onLoginSuccess: (loginType: string, playerName: string) => void;
}

export const LoginChoiceWidget: React.FC<LoginChoiceWidgetProps> = ({ onLoginSuccess }) => {
  const [currentLogin, setCurrentLogin] = useState<string>('guest');
  const [bannedState, setBannedState] = useState<{ isBanned: boolean; provider: string }>({ isBanned: false, provider: '' });

  const login = (type: string) => {
    sound.playClick();
    setCurrentLogin(type);
    localStorage.setItem('login', type);
    const pName = type === 'guest' ? 'Guest 666' : `${type.charAt(0).toUpperCase() + type.slice(1)} Account`;
    onLoginSuccess(type, pName);
  };

  const meetGuest666 = () => {
    sound.playOof();
    if (currentLogin === 'guest') {
      alert('Guest 666 appeared! You are Guest = SAFE, No Ban 👑');
    } else {
      setBannedState({ isBanned: true, provider: currentLogin });
    }
  };

  if (bannedState.isBanned) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-red-500 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
        <div className="max-w-md w-full space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-950 border-2 border-red-600 flex items-center justify-center text-red-500 shadow-2xl animate-pulse">
            <Skull className="w-10 h-10" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-wider text-red-600">
            BANNED
          </h1>
          
          <div className="space-y-2 text-sm text-red-300">
            <p>You used <strong className="text-white capitalize">{bannedState.provider}</strong> account and met Guest 666.</p>
            <p className="text-red-400 font-bold">Guests never get banned. Accounts do.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setBannedState({ isBanned: false, provider: '' });
              login('guest');
            }}
            style={{ padding: '15px 30px', marginTop: '20px' }}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-900/50 cursor-pointer transition-all"
          >
            Restart as Guest (Safe 666)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-2xl max-w-md w-full mx-auto my-4 space-y-4">
      {/* Login Choice Header */}
      <div className="text-center pb-2 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center justify-center gap-1.5">
          <span>Choose Login</span>
          <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />
        </h3>
        <p className="text-xs text-slate-500">Guest 666 Security &amp; Ban Protection</p>
      </div>

      {/* Buttons */}
      <div id="loginChoice" className="space-y-2">
        <button
          type="button"
          onClick={() => login('guest')}
          style={{ background: 'green', color: 'white', padding: '12px', width: '100%', margin: '5px 0', borderRadius: '10px' }}
          className="font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>GUEST - SAFE, No Ban</span>
        </button>

        <button
          type="button"
          onClick={() => login('facebook')}
          style={{ background: '#1877F2', color: 'white', padding: '12px', width: '100%', margin: '5px 0', borderRadius: '10px' }}
          className="font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Facebook Account - BAN RISK</span>
        </button>

        <button
          type="button"
          onClick={() => login('google')}
          style={{ background: '#ffffff', color: '#000000', padding: '12px', width: '100%', margin: '5px 0', borderRadius: '10px', border: '1px solid #cbd5e1' }}
          className="font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Google Account - BAN RISK</span>
        </button>

        <button
          type="button"
          onClick={() => login('apple')}
          style={{ background: 'black', color: 'white', padding: '12px', width: '100%', margin: '5px 0', borderRadius: '10px' }}
          className="font-bold text-sm shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Apple Account - BAN RISK</span>
        </button>
      </div>

      {/* Test Spawn Guest 666 button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={meetGuest666}
          style={{ background: 'red', color: 'white', padding: '15px', width: '100%', marginTop: '10px', borderRadius: '10px' }}
          className="font-black text-sm shadow-lg shadow-red-500/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>SPAWN GUEST 666</span>
        </button>
      </div>
    </div>
  );
};
