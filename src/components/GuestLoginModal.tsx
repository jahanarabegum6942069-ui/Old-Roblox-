import React, { useState } from 'react';
import { AvatarType, GuestProfile, PoseType } from '../types';
import { sound } from '../utils/audio';
import { Sparkles, Check, ShieldCheck, Play, ArrowRight, UserCheck, Smartphone, Crown, Flame } from 'lucide-react';

interface GuestLoginModalProps {
  currentProfile: GuestProfile;
  onConfirmGuest: (profile: GuestProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
  onOpenPhoneCode?: () => void;
  onOpenPlayOnPhone?: () => void;
  onAttemptAccountConnect?: (accountType: string) => void;
}

export const GuestLoginModal: React.FC<GuestLoginModalProps> = ({
  currentProfile,
  onConfirmGuest,
  isOpen,
  onClose,
  canDismiss = false,
  onOpenPhoneCode,
  onOpenPlayOnPhone,
  onAttemptAccountConnect,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>(currentProfile.avatarType);
  // Strictly filter to ONLY Guest 666 - all other numbers blocked!
  const guestNum = 666;
  const [selectedPose, setSelectedPose] = useState<PoseType>(currentProfile.selectedPose || 'idle');
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  // ALL PLAYER TYPES = GUEST 666 - NO WAY TO CHANGE
  const playerTypes: Record<string, string> = {
    "Guest Boy": "Guest 666",
    "Guest Girl": "Guest 666", 
    "Bacon Hair": "Guest 666",
    "Noob": "Guest 666",
    "Rthro": "Guest 666",
    "Any Player": "Guest 666"
  };

  const selectPlayerType = (anyType: string) => {
    let forcedName = "Guest 666";
    console.log(`You picked ${anyType} -> BUT LOCKED TO ${forcedName} - No way to change!`);
    return forcedName;
  };

  const handleSelectAvatar = (type: AvatarType) => {
    sound.playClick();
    setSelectedAvatar(type);
    selectPlayerType(type);
  };

  const handlePose = (pose: PoseType) => {
    sound.playJump();
    setSelectedPose(pose);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handlePlayAsGuest = () => {
    sound.playPlayAsGuest();
    const forcedName = selectPlayerType(selectedAvatar);
    const profile: GuestProfile = {
      ...currentProfile,
      id: forcedName, // always Guest 666
      guestNumber: 666,
      avatarType: selectedAvatar,
      role: 'Guest',
      selectedPose: selectedPose,
      badges: Array.from(new Set([...(currentProfile.badges || []), 'Rare Legendary Edition', 'Guest 666 Legend'])),
    };
    onConfirmGuest(profile);
  };

  const isBoy = selectedAvatar === 'guest_boy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400 ring-4 ring-amber-400/30 overflow-hidden my-auto">
        {/* Header Ribbon with classic BloxHub brand & Gold Glow */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-sky-700 text-white">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-xl tracking-tighter">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-bold tracking-tight text-white font-display">
                    Guest Login
                  </h2>
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>
                <p className="text-xs text-amber-100 font-medium">
                  Instant Play · No account or password needed!
                </p>
              </div>
            </div>

            {/* Rare Legendary Edition Crown Badge with breathing gold glow */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs gold-glow-badge">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>RARE LEGENDARY EDITION</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Avatar Selector Grid: Guest Boy vs Guest Girl */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                1. Choose Your Guest Avatar
              </label>
              <span className="text-xs font-medium text-sky-600">
                Classic Blue Shirt &amp; White R Logo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Option 1: Guest Boy */}
              <button
                type="button"
                onClick={() => handleSelectAvatar('guest_boy')}
                className={`group relative text-left p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  selectedAvatar === 'guest_boy'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                {selectedAvatar === 'guest_boy' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1.5 rounded-xl overflow-hidden bg-white shadow-inner border border-slate-200/80">
                  <img
                    src="/src/assets/images/guest_boy_avatar_1792080024725.jpg"
                    alt="Guest Boy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-slate-900">Guest Boy</div>
                  <div className="text-[10px] text-slate-500">→ Guest 666</div>
                </div>
              </button>

              {/* Option 2: Guest Girl */}
              <button
                type="button"
                onClick={() => handleSelectAvatar('guest_girl')}
                className={`group relative text-left p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  selectedAvatar === 'guest_girl'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                {selectedAvatar === 'guest_girl' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1.5 rounded-xl overflow-hidden bg-white shadow-inner border border-slate-200/80">
                  <img
                    src="/src/assets/images/guest_girl_avatar_1792080024600.jpg"
                    alt="Guest Girl"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-slate-900">Guest Girl</div>
                  <div className="text-[10px] text-slate-500">→ Guest 666</div>
                </div>
              </button>

              {/* Option 3: Bacon Hair */}
              <button
                type="button"
                onClick={() => handleSelectAvatar('bacon_hair')}
                className={`group relative text-left p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  selectedAvatar === 'bacon_hair'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                {selectedAvatar === 'bacon_hair' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1.5 rounded-xl overflow-hidden bg-white shadow-inner border border-slate-200/80">
                  <img
                    src="/src/assets/images/bacon_hair_avatar_1792126996763.jpg"
                    alt="Bacon Hair"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-slate-900">Bacon Hair</div>
                  <div className="text-[10px] text-slate-500">→ Guest 666</div>
                </div>
              </button>

              {/* Option 4: Noob */}
              <button
                type="button"
                onClick={() => handleSelectAvatar('noob')}
                className={`group relative text-left p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  selectedAvatar === 'noob'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                {selectedAvatar === 'noob' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1.5 rounded-xl overflow-hidden bg-white shadow-inner border border-slate-200/80">
                  <img
                    src="/src/assets/images/noob_avatar_1792126997137.jpg"
                    alt="Noob"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-slate-900">Noob</div>
                  <div className="text-[10px] text-slate-500">→ Guest 666</div>
                </div>
              </button>

              {/* Option 5: Rthro */}
              <button
                type="button"
                onClick={() => handleSelectAvatar('rthro')}
                className={`group relative text-left p-3 rounded-2xl border-2 transition-all flex flex-col items-center sm:col-span-2 ${
                  selectedAvatar === 'rthro'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                {selectedAvatar === 'rthro' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-1.5 rounded-xl overflow-hidden bg-white shadow-inner border border-slate-200/80">
                  <img
                    src="/src/assets/images/rthro_avatar_1792126997636.jpg"
                    alt="Rthro"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-xs font-bold text-slate-900">Rthro Hero</div>
                  <div className="text-[10px] text-slate-500">→ Guest 666</div>
                </div>
              </button>
            </div>
          </div>

          {/* Locked Player Selector Element as requested by code snippet */}
          <div className="p-3 bg-amber-100/70 rounded-2xl border border-amber-300 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">Player Type Selector:</span>
            <button
              id="playerTypeSelector"
              disabled={true}
              className="px-3 py-1.5 bg-amber-200 text-amber-950 font-black text-xs rounded-xl border border-amber-400 cursor-not-allowed shadow-inner"
            >
              LOCKED: Guest 666 - No way to change
            </button>
          </div>

          {/* Guest Identity: STRICTLY LOCKED TO GUEST 666 (Gold Glow & Crown) */}
          <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/80 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                <Crown className="w-6 h-6 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black text-amber-950 font-display tracking-tight flex items-center gap-1.5">
                    <span>Guest 666</span>
                    <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                  </div>
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-md tracking-wider">
                    MYTHIC
                  </span>
                </div>
                <div className="text-xs text-amber-900 font-semibold mt-0.5">
                  Role: Guest · Special Rare Legendary Edition (Locked to 666)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {(['wave', 'cheer', 'jump'] as PoseType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePose(p)}
                  className="px-2.5 py-2 text-xs font-semibold capitalize text-amber-900 bg-white border border-amber-300 rounded-xl hover:bg-amber-100 active:scale-95 transition-all shadow-xs"
                  title={`Make Guest 666 ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Privileges & Information */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <div className="font-semibold text-slate-800">No Account</div>
              <div className="text-[11px] text-slate-500">Instant Access</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <div className="font-semibold text-slate-800">100% Free</div>
              <div className="text-[11px] text-slate-500">All Games Unlocked</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
              <div className="font-semibold text-slate-800">Safe Quick-Chat</div>
              <div className="text-[11px] text-slate-500">Kid-Friendly Mode</div>
            </div>
          </div>

          {/* BIG BLUE PLAY AS GUEST BUTTON (Required!) */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handlePlayAsGuest}
              className="blox-btn-blue w-full h-14 rounded-2xl text-white font-bold text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-sky-600/30 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
              </div>
              <span className="font-display">PLAY AS GUEST</span>
              <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Phone Code & Play on Phone Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {onOpenPhoneCode && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenPhoneCode();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                    <Smartphone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">
                      {currentProfile.phoneVerified ? 'Phone Verified ✓' : 'Phone 6-Digit Code'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 ml-1 shrink-0">
                    {currentProfile.phoneVerified ? 'View' : 'Enter'}
                  </span>
                </button>
              )}

              {onOpenPlayOnPhone && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenPlayOnPhone();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200 text-xs transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-sky-900 font-semibold truncate">
                    <Smartphone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Play on Mobile Phone</span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 ml-1 shrink-0">
                    Scan QR
                  </span>
                </button>
              )}
            </div>

            {/* Account connection attempt options (triggers Security Breach alert!) */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Or Connect Account (⚠️ Triggers Security Breach &amp; Ban Risk)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onAttemptAccountConnect?.('Google')}
                  className="py-2 px-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAttemptAccountConnect?.('Facebook')}
                  className="py-2 px-2 bg-[#1877F2] hover:bg-[#166fe5] border border-[#1877F2] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <span>Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAttemptAccountConnect?.('Apple')}
                  className="py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
                >
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>

          {canDismiss && onClose && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Keep current profile and close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
