import React, { useState } from 'react';
import { GuestProfile } from '../types';
import { sound } from '../utils/audio';

interface SubscriptionWidgetProps {
  profile: GuestProfile;
  onUpdateProfile: (updated: Partial<GuestProfile>) => void;
}

export const SubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({ profile, onUpdateProfile }) => {
  const [sub, setSub] = useState<string>(localStorage.getItem("bloxhub_sub") || "FREE");
  const [idCheck, setIdCheck] = useState('');
  const [blockAreaVisible, setBlockAreaVisible] = useState(false);
  const [codeRevealVisible, setCodeRevealVisible] = useState(false);
  const [creatorModeActive, setCreatorModeActive] = useState(false);
  const [platformSubActive, setPlatformSubActive] = useState(false);
  
  const [joined, setJoined] = useState(false);
  const [friends, setFriends] = useState<{id: number, icon: string, turned: boolean}[]>([]);
  const [extraTrackVisible, setExtraTrackVisible] = useState(false);
  const [extraFriends, setExtraFriends] = useState<{id: number, icon: string, turned: boolean}[]>([]);

  const buy = (type: string) => {
    setSub(type);
    localStorage.setItem("bloxhub_sub", type);
    sound.playClick();
    if(navigator.vibrate) navigator.vibrate(100);
  };

  const getFreeBlocks = () => {
    setBlockAreaVisible(true);
    sound.playClick();
    if(navigator.vibrate) navigator.vibrate(100);
  };

  const createBlock = () => {
    const b = prompt("Name your block:");
    if(b) alert("Block '"+b+"' created! Free for 6666 players");
  };

  const verifyFor666 = () => {
    if(idCheck.length < 2){ alert("Enter anything to get 666 users"); return; }
    setCodeRevealVisible(true);
    setCreatorModeActive(true);
    sound.playClick();
    if(navigator.vibrate) navigator.vibrate([300,100,300,100,500]);
  };

  const activatePlatformSub = () => {
    setPlatformSubActive(true);
    sound.playClick();
  };

  const activate666Mode = () => {
    sound.playClick();
    onUpdateProfile({ robux: (profile.robux || 0) + 666 });
    joinTrack();
    showExtra();
  };

  const joinTrack = () => {
    if(joined) return;
    setJoined(true);
    onUpdateProfile({ robux: (profile.robux || 0) + 67 });
    const icons = ["👤","👥","🧒","👦","👧","🧑","👨","👩"];
    setFriends(icons.map((icon, i) => ({ id: i, icon, turned: false })));
  };

  const showExtra = () => {
    setExtraTrackVisible(true);
    onUpdateProfile({ robux: (profile.robux || 0) + 70 });
    const icons = ["👱","🧑🤝🧑","👶","👴","👵","👨👩👧👦","🤝","👫"];
    setExtraFriends(icons.map((icon, i) => ({ id: i, icon, turned: false })));
  };

  const turnFriend = (id: number, isExtra: boolean) => {
    if(isExtra) {
        setExtraFriends(prev => prev.map(f => f.id === id ? { ...f, turned: true } : f));
    } else {
        setFriends(prev => prev.map(f => f.id === id ? { ...f, turned: true } : f));
    }
    if(navigator.vibrate) navigator.vibrate(50);
  };

  const allTurned = (friends.length > 0 && friends.every(f => f.turned)) && 
                    (extraTrackVisible ? (extraFriends.length > 0 && extraFriends.every(f => f.turned)) : true);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0a0a0a] text-white font-mono rounded-3xl relative">
        {creatorModeActive && (
          <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-[100] p-6 text-center">
            <h1 className="text-red-600 text-6xl font-black">R666</h1>
            <h2 className="text-2xl mt-4">CREATOR MODE</h2>
            <button onClick={() => location.reload()} className="p-4 bg-white text-black font-bold rounded-xl mt-8">Back to BLOXHUB</button>
          </div>
        )}

        <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-widest py-4">BLOXHUB</h1>
            <div className="text-xl font-bold mb-2">R$ {profile.robux}</div>
            <div className="opacity-50">Guest 666 | {sub} ACTIVE</div>
            
            <button 
                onClick={activate666Mode}
                className="mt-6 p-4 w-full bg-red-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-red-700 transition-all"
            >
                SWITCH TO 666
            </button>
        </div>

        {/* ... (Blocks/ID/Sub sections) ... */}

        <div className="mb-8">
            <button className="w-full bg-white text-black p-4 rounded-xl font-bold mb-4" onClick={joinTrack}>JOIN TRACK</button>
            <div id="track" className="relative h-[300px] bg-[#050505] border border-slate-800 rounded-2xl overflow-hidden mb-4">
                <div className="p-4 opacity-30">Main Track {joined ? '- You joined' : ''}</div>
                {friends.map(f => (
                    <div key={f.id} onClick={() => turnFriend(f.id, false)} className="absolute cursor-pointer transition-all duration-300" style={{ left: f.turned ? '44%' : Math.random()*80 + '%', top: f.turned ? '40%' : Math.random()*60 + 20 + '%' }}>
                        {f.turned ? <span className="text-black bg-white px-2 py-1 rounded font-black text-xs">YOU</span> : f.icon}
                    </div>
                ))}
            </div>
            
            {joined && (
                <button className="w-full bg-[#ff0044] text-white p-4 rounded-xl font-bold mb-4" onClick={showExtra}>SHOW EXTRA FRIEND TRACKING</button>
            )}

            {extraTrackVisible && (
                <div id="extraTrack" className="relative h-[25vh] bg-slate-950 border-dashed border-red-500 border-2 rounded-2xl overflow-hidden mb-4">
                    <div className="p-4 opacity-30 text-red-500">Extra Friend Tracking</div>
                    {extraFriends.map(f => (
                        <div key={f.id} onClick={() => turnFriend(f.id, true)} className="absolute cursor-pointer transition-all duration-300" style={{ left: f.turned ? '44%' : Math.random()*80 + '%', top: f.turned ? '40%' : Math.random()*50 + 25 + '%' }}>
                            {f.turned ? <span className="text-white bg-[#ff0044] px-2 py-1 rounded font-black text-xs">EXTRA YOU</span> : f.icon}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="mt-4 opacity-70 text-center font-bold">
            {allTurned ? <span className="text-red-500">EVERYONE + EXTRA FRIENDS TURNED INTO YOU</span> : "Join to turn everyone into you"}
        </div>
    </div>
  );
};
