import React, { useState } from 'react';
import { GameItem, GuestProfile } from './types';
import { TiltedTowersBackground } from './components/TiltedTowersBackground';
import { GuestLoginModal } from './components/GuestLoginModal';
import { LightTopBar } from './components/LightTopBar';
import { PopularGamesList } from './components/PopularGamesList';
import { GameDetailsModal } from './components/GameDetailsModal';
import { GuestAvatarViewer } from './components/GuestAvatarViewer';
import { GuestChatDrawer } from './components/GuestChatDrawer';
import { PhoneCodeModal } from './components/PhoneCodeModal';
import { RedeemCodeModal } from './components/RedeemCodeModal';
import { PlayOnPhoneModal } from './components/PlayOnPhoneModal';
import { PhoneSimulatorFrame } from './components/PhoneSimulatorFrame';
import { LogPanelWidget } from './components/LogPanelWidget';
import { FortniteBattleBusGame } from './components/games/FortniteBattleBusGame';
import { AnimalHospitalGame } from './components/games/AnimalHospitalGame';
import { sound } from './utils/audio';
import { BloxHubArenaWidget } from './components/BloxHubArenaWidget';
import { SubscriptionWidget } from './components/SubscriptionWidget';
import { Gamepad2, User, MessageSquare, ShieldCheck, Sparkles, Trophy, CreditCard } from 'lucide-react';

export default function App() {
  // Guest profile state: Strictly locked to Guest 666 (Rare Legendary Edition)
  const [profile, setProfile] = useState<GuestProfile>({
    id: 'Guest 666',
    avatarType: 'guest_boy',
    role: 'Guest', // explicit role = Guest
    guestNumber: 666,
    robux: 0,
    badges: ['Rare Legendary Edition', 'Guest 666 Legend', 'First Drop', 'Classic Blue R'],
    selectedPose: 'idle',
    phoneVerified: false,
  });

  // Hub UI state
  const [hasLoggedInAsGuest, setHasLoggedInAsGuest] = useState<boolean>(false);
  const [isGuestSwitchModalOpen, setIsGuestSwitchModalOpen] = useState<boolean>(false);
  const [isPhoneCodeModalOpen, setIsPhoneCodeModalOpen] = useState<boolean>(false);
  const [isPlayOnPhoneModalOpen, setIsPlayOnPhoneModalOpen] = useState<boolean>(false);
  const [isPhoneFrameActive, setIsPhoneFrameActive] = useState<boolean>(false);
  const [isRedeemCodeModalOpen, setIsRedeemCodeModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'games' | 'avatar' | 'chat' | 'subscription'>('games');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Security Breach overlay state for non-guest account attempts
  const [securityBreachActive, setSecurityBreachActive] = useState<boolean>(false);
  const [attemptedAccountType, setAttemptedAccountType] = useState<string | null>(null);

  const handleAttemptAccountConnect = (accountType: string) => {
    sound.playGuest666Glitch();
    setAttemptedAccountType(accountType);
    setSecurityBreachActive(true);
  };

  // Game launcher state
  const [activeRunningGame, setActiveRunningGame] = useState<GameItem | null>(null);
  const [selectedGameDetails, setSelectedGameDetails] = useState<GameItem | null>(null);
  const [guestScore, setGuestScore] = useState<number>(0);

  // Guest confirmation handler - strictly locked to Guest 666
  const handleConfirmGuest = (newProfile: GuestProfile) => {
    setProfile({
      ...newProfile,
      id: 'Guest 666',
      guestNumber: 666,
    });
    setHasLoggedInAsGuest(true);
    setIsGuestSwitchModalOpen(false);
  };

  const handleUpdateProfile = (updated: Partial<GuestProfile>) => {
    setProfile((prev) => ({ 
      ...prev, 
      ...updated,
      id: 'Guest 666', // strictly locked to 666
      guestNumber: 666,
    }));
  };

  const handlePhoneVerified = (phoneNumber: string, quickCode: string) => {
    setProfile((prev) => {
      const updatedBadges = prev.badges.includes('Phone Verified')
        ? prev.badges
        : [...prev.badges, 'Phone Verified'];
      return {
        ...prev,
        phoneVerified: true,
        phoneNumber,
        phoneQuickCode: quickCode,
        badges: updatedBadges,
      };
    });
  };

  const handleLaunchGame = (game: GameItem) => {
    sound.playClick();
    setSelectedGameDetails(null);
    setActiveRunningGame(game);
  };

  const handleExitGame = () => {
    setActiveRunningGame(null);
  };

  const appContent = (
    <div className="min-h-screen relative flex flex-col bg-slate-100 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Tilted Towers Atmospheric Background */}
      <TiltedTowersBackground opacity={hasLoggedInAsGuest ? 0.35 : 0.85} />

      {/* Initial Guest Login Modal or Guest Switch Modal */}
      {(!hasLoggedInAsGuest || isGuestSwitchModalOpen) && (
        <GuestLoginModal
          currentProfile={profile}
          onConfirmGuest={handleConfirmGuest}
          isOpen={!hasLoggedInAsGuest || isGuestSwitchModalOpen}
          canDismiss={hasLoggedInAsGuest}
          onClose={() => setIsGuestSwitchModalOpen(false)}
          onOpenPhoneCode={() => setIsPhoneCodeModalOpen(true)}
          onOpenPlayOnPhone={() => setIsPlayOnPhoneModalOpen(true)}
          onAttemptAccountConnect={handleAttemptAccountConnect}
        />
      )}

      {/* GLOBAL SECURITY BREACH NOTIFICATION OVERLAY */}
      {securityBreachActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-slate-900 border-4 border-red-600 rounded-3xl p-8 text-center text-white shadow-2xl shadow-red-600/50 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center animate-bounce">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-red-500 font-display uppercase animate-pulse">
                SECURITY BREACH: ONLY GUESTS ALLOWED
              </h1>
              <p className="text-sm text-slate-300">
                Attempted connection with <span className="font-bold text-amber-400">{attemptedAccountType || 'Non-Guest'} Account</span> detected!
              </p>
              <p className="text-xs text-red-400 font-semibold leading-relaxed">
                Real user accounts (Google, Facebook, Apple) risk permanent bans. Guests (specifically Guest 666) never get banned and are 100% safe. All other account logins are strictly prohibited.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSecurityBreachActive(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base rounded-2xl shadow-lg shadow-red-600/40 uppercase tracking-widest transition-all cursor-pointer"
              >
                Return to Guest 666 (Safe)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Code Verification Modal */}
      <PhoneCodeModal
        isOpen={isPhoneCodeModalOpen}
        onClose={() => setIsPhoneCodeModalOpen(false)}
        profile={profile}
        onPhoneVerified={handlePhoneVerified}
      />

      {/* Redeem Code Modal */}
      <RedeemCodeModal
        isOpen={isRedeemCodeModalOpen}
        onClose={() => setIsRedeemCodeModalOpen(false)}
      />

      {/* Play on Phone QR Code Modal */}
      <PlayOnPhoneModal
        isOpen={isPlayOnPhoneModalOpen}
        onClose={() => setIsPlayOnPhoneModalOpen(false)}
        isPhoneFrameActive={isPhoneFrameActive}
        onTogglePhoneFrame={() => setIsPhoneFrameActive(!isPhoneFrameActive)}
      />

      {/* Active Running Mini-Game Shell */}
      {activeRunningGame?.type === 'fortnite_battle_bus' && (
        <FortniteBattleBusGame
          profile={profile}
          onExit={handleExitGame}
          onVictory={(score) => {
            setGuestScore((prev) => prev + score);
            if (!profile.badges.includes('Tilted Explorer')) {
              setProfile((p) => ({ ...p, badges: [...p.badges, 'Tilted Explorer'] }));
            }
          }}
        />
      )}

      {activeRunningGame?.type === 'animal_hospital' && (
        <AnimalHospitalGame
          profile={profile}
          onExit={handleExitGame}
          onVictory={(count) => {
            setGuestScore((prev) => prev + count * 250);
            if (!profile.badges.includes('Pet Healer')) {
              setProfile((p) => ({ ...p, badges: [...p.badges, 'Pet Healer'] }));
            }
          }}
        />
      )}

      {/* Top Navigation Bar with Light Modern Clean Theme */}
      <LightTopBar
        profile={profile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenGuestSwitch={() => setIsGuestSwitchModalOpen(true)}
        onOpenAvatarCustomizer={() => setActiveTab('avatar')}
        onOpenPhoneCode={() => setIsPhoneCodeModalOpen(true)}
        onOpenPlayOnPhone={() => setIsPlayOnPhoneModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12">
        {activeTab === 'games' && (
          <div className="space-y-6">
            <BloxHubArenaWidget />
            <LogPanelWidget
              onNameLock={(lockedName) => {
                setProfile((p) => ({ ...p, id: lockedName }));
              }}
            />
            <PopularGamesList
              searchQuery={searchQuery}
              onLaunchGame={handleLaunchGame}
              onSelectGameDetails={setSelectedGameDetails}
              onOpenRedeemCode={() => setIsRedeemCodeModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'avatar' && (
          <GuestAvatarViewer
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'subscription' && (
          <SubscriptionWidget profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === 'chat' && (
          <GuestChatDrawer
            profile={profile}
          />
        )}
      </main>

      {/* Game Details Popup Modal */}
      <GameDetailsModal
        game={selectedGameDetails}
        profile={profile}
        isOpen={Boolean(selectedGameDetails)}
        onClose={() => setSelectedGameDetails(null)}
        onLaunchGame={handleLaunchGame}
      />

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
          {/* Tab 1: Games */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('games');
            }}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'games' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[11px] font-bold mt-1">Games</span>
          </button>

          {/* Tab 2: My Guest Avatar */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('avatar');
            }}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'avatar' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-bold mt-1">Avatar</span>
          </button>

          {/* Tab 3: Guest Safe Chat */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('chat');
            }}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'chat' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[11px] font-bold mt-1">Chat</span>
          </button>

          {/* Tab 4: Subscriptions */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('subscription');
            }}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === 'subscription' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[11px] font-bold mt-1">Sub</span>
          </button>
        </div>
      </nav>
    </div>
  );

  if (isPhoneFrameActive) {
    return (
      <PhoneSimulatorFrame onExitPhoneFrame={() => setIsPhoneFrameActive(false)}>
        {appContent}
      </PhoneSimulatorFrame>
    );
  }

  return appContent;
}
