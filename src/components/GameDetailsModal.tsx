import React, { useState } from 'react';
import { GameItem, GuestProfile } from '../types';
import { sound } from '../utils/audio';
import { 
  X, Play, ThumbsUp, ThumbsDown, Star, Users, 
  ShieldCheck, Share2, Server, Gamepad2, Crown 
} from 'lucide-react';

interface GameDetailsModalProps {
  game: GameItem | null;
  profile: GuestProfile;
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (game: GameItem) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  profile,
  isOpen,
  onClose,
  onLaunchGame,
}) => {
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  if (!isOpen || !game) return null;

  const handleToggleLike = () => {
    sound.playClick();
    setHasLiked(!hasLiked);
  };

  const handleToggleFav = () => {
    sound.playCollect();
    setIsFavorited(!isFavorited);
  };

  const clipGame = (gameName: string) => {
    // When player clicks CLIP in BloxHub
    const clipData = {
      game: gameName,
      mode: "Guest 666",
      robux: profile.robux,
      extraTracking: true
    };
    
    // This will open Medal app if installed
    window.open(`medal://clip?game=${gameName}&mode=666`, "_blank");
    console.log("Clipped on BloxHub:", clipData);
    sound.playClick();
  };

  const handleCodeClick = () => {
    const code = prompt("Enter promotional code:");
    if (code) {
        alert("Code '" + code + "' submitted!");
        sound.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Hero Banner */}
        <div className="relative aspect-video w-full bg-slate-950">
          <img
            src={game.image}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Quick Play CTA Overlay in Banner */}
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight drop-shadow-md">
                {game.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-sky-200 font-medium">
                <span>By {game.creator}</span>
                <span aria-hidden="true" className="text-sky-400">·</span>
                <span className="font-mono tabular-nums">{game.playingCount} Playing</span>
              </div>
            </div>

            <div className="flex gap-2">
                <button
                type="button"
                onClick={() => {
                    sound.playClick();
                    onLaunchGame(game);
                }}
                className="blox-btn-green px-6 py-3.5 rounded-2xl text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-950/40 cursor-pointer shrink-0"
                >
                <Play className="w-5 h-5 fill-white text-white" />
                <span>PLAY NOW</span>
                </button>
                <button 
                    onClick={() => clipGame(game.title)}
                    className="bg-black/50 hover:bg-black/70 px-6 py-3.5 rounded-2xl text-white font-black text-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                    📺 CLIP IT
                </button>
                <button 
                    onClick={handleCodeClick}
                    className="bg-amber-500 hover:bg-amber-600 px-6 py-3.5 rounded-2xl text-white font-black text-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                    🔑 CODE
                </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Action Row & Reactions */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  hasLiked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-emerald-600' : ''}`} />
                <span>{hasLiked ? game.rating + 1 : game.rating}%</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFav}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isFavorited
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>Favorite</span>
              </button>
            </div>

            {/* Guest Role Notice with Gold Crown */}
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Playing as <strong className="font-black text-amber-950">Guest 666</strong> (Role: Guest · <span className="font-extrabold text-amber-800">RARE LEGENDARY EDITION</span>)</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About Experience
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-medium">Category</div>
              <div className="font-bold text-slate-800 capitalize mt-0.5">{game.category}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-medium">Server Status</div>
              <div className="font-bold text-slate-800 mt-0.5">{game.serverRegion || 'US-East'}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-medium">Max Players</div>
              <div className="font-bold text-slate-800 mt-0.5">50 Guests</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-400 font-medium">Account Req</div>
              <div className="font-bold text-emerald-600 mt-0.5">None (Guest Free)</div>
            </div>
          </div>

          {/* Big Launch Button */}
          <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                sound.playClick();
                onLaunchGame(game);
                }}
                className="blox-btn-green flex-1 h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl cursor-pointer"
            >
                <Play className="w-5 h-5 fill-white text-white" />
                <span className="font-display">LAUNCH EXPERIENCE AS GUEST 666 👑</span>
            </button>
            <button 
                onClick={() => clipGame(game.title)}
                className="bg-black/10 hover:bg-black/20 w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer"
                title="Clip It"
            >
                📺
            </button>
            <button 
                onClick={handleCodeClick}
                className="bg-black/10 hover:bg-black/20 w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer"
                title="Code"
            >
                🔑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
