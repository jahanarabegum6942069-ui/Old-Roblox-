import React, { useState } from 'react';
import { GuestProfile } from '../types';
import { sound } from '../utils/audio';
import { Search, Volume2, VolumeX, User, Sparkles, X, ShieldAlert, CircleDot, Smartphone, Check } from 'lucide-react';

interface LightTopBarProps {
  profile: GuestProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenGuestSwitch: () => void;
  onOpenAvatarCustomizer: () => void;
  onOpenPhoneCode: () => void;
  onOpenPlayOnPhone: () => void;
  activeTab: 'games' | 'avatar' | 'chat' | 'subscription';
  onTabChange: (tab: 'games' | 'avatar' | 'chat' | 'subscription') => void;
}

export const LightTopBar: React.FC<LightTopBarProps> = ({
  profile,
  searchQuery,
  onSearchChange,
  onOpenGuestSwitch,
  onOpenAvatarCustomizer,
  onOpenPhoneCode,
  onOpenPlayOnPhone,
  activeTab,
  onTabChange,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const isBoy = profile.avatarType === 'guest_boy';
  const avatarImg = isBoy
    ? '/src/assets/images/guest_boy_avatar_1792080024725.jpg'
    : '/src/assets/images/guest_girl_avatar_1792080024600.jpg';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Zone 1: Brand & Guest Identity */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Clickable Guest Avatar Icon with glowing gold ring */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAvatarCustomizer();
              }}
              className="relative group p-0.5 rounded-2xl ring-2 ring-amber-400 hover:ring-amber-500 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              title="Customize Guest 666 Avatar"
            >
              <div className="w-10 h-10 rounded-[14px] overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={avatarImg}
                  alt="Guest 666"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              {/* White 'R' badge mini pin */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sky-600 text-[9px] font-black text-white flex items-center justify-center border-2 border-white shadow-xs">
                R
              </div>
            </button>

            {/* Guest Name & Role = Guest Tag with RARE LEGENDARY EDITION Crown */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-amber-950 tracking-tight leading-none font-display flex items-center gap-1">
                  <span>Guest 666</span>
                  <span className="text-amber-500">👑</span>
                </span>
                
                {/* RARE LEGENDARY EDITION Crown Badge with breathing gold glow */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] tracking-wider gold-glow-badge red-glitch">
                  <span>RARE LEGENDARY EDITION</span>
                </span>

                {/* Avatar Switcher CTA */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenGuestSwitch();
                  }}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Style
                </button>
              </div>

              {/* Clean Unboxed Role Metadata */}
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                <span className="font-semibold text-slate-800">Role: Guest</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-amber-700 font-bold sm:hidden">RARE LEGENDARY EDITION</span>
                <span className="text-slate-500 hidden sm:inline">100% Free Access</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Clean Search Input */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Fortnite Battle Bus, Animal Hospital, Obbies..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSearchChange('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Zone 3: Navigation Tabs & Robux / Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange('games');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'games'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Games Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange('avatar');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'avatar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Guest Avatar
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange('chat');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guest Chat
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange('subscription');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'subscription'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Subscription
              </button>
            </nav>

            {/* Robux Balance Pill - Classic R$ 0 for Guests */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
              title="Guests have 0 Robux - All games are 100% Free!"
            >
              <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                R$
              </div>
              <span className="font-mono">{profile.robux}</span>
            </div>

            {/* Play on Phone Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenPlayOnPhone();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer shadow-2xs"
              title="Play on Phone via QR Code or Phone View"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Play on Phone</span>
            </button>

            {/* Phone Code Verification Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenPhoneCode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                profile.phoneVerified
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
              }`}
              title={profile.phoneVerified ? `Verified: ${profile.phoneNumber}` : 'Verify via 6-digit Phone Code'}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">
                {profile.phoneVerified ? 'Phone ✓' : 'Phone Code'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all border border-slate-200/70 cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Switch Profile CTA button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenGuestSwitch();
              }}
              className="xs:hidden w-9 h-9 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 flex items-center justify-center border border-sky-200"
              title="Switch Guest"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Fortnite, Animal Hospital, Obby..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSearchChange('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
