import React, { useState } from 'react';
import { DarkVoidParticles } from './DarkVoidParticles';
import { AvatarType, GuestProfile, PoseType } from '../types';
import { sound } from '../utils/audio';
import { 
  Check, Sparkles, Award, ShieldCheck, 
  HelpCircle, Trophy, Play, Crown, Flame, Volume2 
} from 'lucide-react';

interface GuestAvatarViewerProps {
  profile: GuestProfile;
  onUpdateProfile: (updated: Partial<GuestProfile>) => void;
}

export const GuestAvatarViewer: React.FC<GuestAvatarViewerProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [activePose, setActivePose] = useState<PoseType>(profile.selectedPose || 'idle');
  const [isPoseActive, setIsPoseActive] = useState<boolean>(false);
  const [isGlitchPlaying, setIsGlitchPlaying] = useState<boolean>(false);

  const getAvatarImage = (type: AvatarType) => {
    switch (type) {
      case 'guest_girl': return '/src/assets/images/guest_girl_avatar_1792080024600.jpg';
      case 'bacon_hair': return '/src/assets/images/bacon_hair_avatar_1792126996763.jpg';
      case 'noob': return '/src/assets/images/noob_avatar_1792126997137.jpg';
      case 'rthro': return '/src/assets/images/rthro_avatar_1792126997636.jpg';
      case 'guest_boy':
      default:
        return '/src/assets/images/guest_boy_avatar_1792080024725.jpg';
    }
  };

  const avatarImage = getAvatarImage(profile.avatarType);

  const handleSelectAvatar = (type: AvatarType) => {
    sound.playClick();
    onUpdateProfile({ avatarType: type });
  };

  const handleTriggerPose = (pose: PoseType) => {
    setActivePose(pose);
    setIsPoseActive(true);

    if (pose === 'jump') sound.playJump();
    else if (pose === 'cheer') sound.playPlayAsGuest();
    else sound.playClick();

    setTimeout(() => {
      setIsPoseActive(false);
      setActivePose('idle');
    }, 1200);
  };

  const handlePlayGlitchVoice = () => {
    sound.playGuest666Glitch();
    setIsGlitchPlaying(true);
    setTimeout(() => {
      setIsGlitchPlaying(false);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-950 font-display">
            Guest 666 Avatar
          </h2>
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs gold-glow-badge">
            <Crown className="w-3.5 h-3.5 fill-slate-950" />
            <span>RARE LEGENDARY EDITION</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 font-medium">
          Exclusive Mythic Guest 666 wearing the legendary classic royal blue Roblox shirt with white R logo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Character Stage with Gold Glow */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border-2 border-amber-400 ring-4 ring-amber-400/20 shadow-xl shadow-amber-500/15 flex flex-col items-center justify-between">
          {/* Identity Tag Header */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="font-black text-amber-950 font-display text-xl flex items-center gap-1.5">
                <span>Guest 666</span>
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
              </span>
              {/* HIDDEN AUDIO BUTTON */}
              <button
                type="button"
                onClick={handlePlayGlitchVoice}
                title="Play Guest 666 Glitchy Deep-Voice Sample"
                className={`p-1.5 rounded-lg border transition-all ${
                  isGlitchPlaying
                    ? 'bg-red-600 text-white border-red-600 animate-pulse scale-110 shadow-lg shadow-red-500/50'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 opacity-80 hover:opacity-100'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-full text-xs font-black shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: Guest</span>
            </div>
          </div>

          {/* Avatar Character Display */}
          <div className="relative my-6 flex flex-col items-center justify-center">
            {/* Pedestal with Gold Glow */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100/60 via-yellow-50 to-slate-100 border-2 border-amber-300 shadow-xl flex items-center justify-center ring-4 ring-amber-400/20">
              <img
                src={avatarImage}
                alt="Guest 666"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isPoseActive && activePose === 'jump'
                    ? '-translate-y-6 scale-105'
                    : isPoseActive && activePose === 'cheer'
                    ? 'scale-110'
                    : isPoseActive && activePose === 'dance'
                    ? 'rotate-3 scale-105'
                    : 'hover:scale-102'
                }`}
              />
              <DarkVoidParticles />

              {/* RARE LEGENDARY EDITION Badge on top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="px-2.5 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1 border border-yellow-100">
                  <Crown className="w-3 h-3 fill-slate-950" />
                  <span>RARE LEGENDARY EDITION</span>
                </div>
                <div className="px-2 py-1 bg-sky-600 text-white rounded-lg text-xs font-black shadow-md">
                  R
                </div>
              </div>
            </div>

            {/* Action Feedback Prompt */}
            {isPoseActive && (
              <div className="mt-3 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full animate-bounce">
                Animation: {activePose.toUpperCase()}!
              </div>
            )}
          </div>

          {/* Animation / Emote Bar */}
          <div className="w-full">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Guest Emotes &amp; Animations
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['wave', 'cheer', 'dance', 'jump'] as PoseType[]).map((pose) => (
                <button
                  key={pose}
                  type="button"
                  onClick={() => handleTriggerPose(pose)}
                  className={`py-2 px-1 text-xs font-bold capitalize rounded-xl border transition-all ${
                    activePose === pose && isPoseActive
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {pose}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Avatar Chooser & Classic Lore */}
        <div className="md:col-span-6 space-y-6">
          {/* Avatar Switcher */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Choose Avatar Style
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { type: 'guest_boy', label: 'Guest Boy', desc: 'Black Cap', img: '/src/assets/images/guest_boy_avatar_1792080024725.jpg' },
                { type: 'guest_girl', label: 'Guest Girl', desc: 'Pink Ribbons', img: '/src/assets/images/guest_girl_avatar_1792080024600.jpg' },
                { type: 'bacon_hair', label: 'Bacon Hair', desc: 'Spiky Hair', img: '/src/assets/images/bacon_hair_avatar_1792126996763.jpg' },
                { type: 'noob', label: 'Noob', desc: 'Green Shirt', img: '/src/assets/images/noob_avatar_1792126997137.jpg' },
                { type: 'rthro', label: 'Rthro Hero', desc: 'Armor Suit', img: '/src/assets/images/rthro_avatar_1792126997636.jpg' },
              ].map((item) => {
                const active = profile.avatarType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleSelectAvatar(item.type as AvatarType)}
                    className={`p-2.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                      active
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500">→ Guest 666</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locked Player Selector Element */}
          <div className="p-3 bg-amber-100/70 rounded-2xl border border-amber-300 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">Player Type Selector:</span>
            <button
              id="playerTypeSelector"
              disabled={true}
              className="px-3 py-1.5 bg-amber-200 text-amber-950 font-black text-xs rounded-xl border border-amber-400 cursor-not-allowed shadow-inner"
            >
              LOCKED: Guest 666 - No change
            </button>
          </div>

          {/* Guest Badges Showcase */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Guest Achievements
              </h3>
              <span className="text-xs text-sky-600 font-semibold">
                {profile.badges.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Rare Legendary Edition Crown Badge */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 flex items-center gap-2.5 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                  👑
                </div>
                <div>
                  <div className="font-black text-amber-950">RARE LEGENDARY</div>
                  <div className="text-[10px] text-amber-800 font-bold">Locked to Guest 666</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🪂
                </div>
                <div>
                  <div className="font-bold text-slate-800">First Drop</div>
                  <div className="text-[11px] text-slate-500">Battle Bus Skydiver</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  🐾
                </div>
                <div>
                  <div className="font-bold text-slate-800">Pet Healer</div>
                  <div className="text-[11px] text-slate-500">Animal Hospital Vet</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  👕
                </div>
                <div>
                  <div className="font-bold text-slate-800">Classic Blue R</div>
                  <div className="text-[11px] text-slate-500">Iconic Guest Outfit</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🏙️
                </div>
                <div>
                  <div className="font-bold text-slate-800">Tilted Visitor</div>
                  <div className="text-[11px] text-slate-500">Clock Tower Landed</div>
                </div>
              </div>

              {/* Phone Verified Badge */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                profile.phoneVerified
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  📱
                </div>
                <div>
                  <div className="font-bold text-slate-800">Phone Verified</div>
                  <div className="text-[11px] text-slate-500">
                    {profile.phoneVerified ? '6-Digit Code Verified ✓' : 'Unverified Phone'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classic Guest 666 Lore Callout */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 text-xs text-amber-950 space-y-1.5 shadow-sm">
            <div className="font-black text-sm text-amber-900 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>The Legend of Guest 666 (Rare Legendary Edition)</span>
            </div>
            <p className="text-amber-900 leading-relaxed font-medium">
              In classic Roblox lore, <strong>Guest 666</strong> is the ultimate mythic legend! In this special edition, all other guest numbers are permanently blocked — you exclusively play with the golden glow, royal crown, and iconic blue R shirt of the legendary Guest 666.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
