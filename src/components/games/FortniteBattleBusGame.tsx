import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GuestProfile } from '../../types';
import { sound } from '../../utils/audio';
import { 
  X, Volume2, VolumeX, RotateCcw, Trophy, Wind, Sparkles, 
  ArrowLeft, ArrowRight, Shield, Zap, Flame, Compass 
} from 'lucide-react';

interface FortniteBattleBusGameProps {
  profile: GuestProfile;
  onExit: () => void;
  onVictory: (score: number) => void;
}

interface SkyCollectible {
  id: number;
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  type: 'star' | 'slurp' | 'storm' | 'coin';
  collected: boolean;
}

export const FortniteBattleBusGame: React.FC<FortniteBattleBusGameProps> = ({
  profile,
  onExit,
  onVictory,
}) => {
  // Game states: 'bus_ride' | 'skydiving' | 'gliding' | 'landed' | 'game_over'
  const [gameState, setGameState] = useState<'bus_ride' | 'skydiving' | 'gliding' | 'landed' | 'game_over'>('bus_ride');
  
  // Player physical variables
  const [playerX, setPlayerX] = useState<number>(50); // percentage 10 to 90
  const [altitude, setAltitude] = useState<number>(1000); // meters from 1000 to 0
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [streak, setStreak] = useState<number>(0);
  const [landedLocation, setLandedLocation] = useState<string>('');

  // Collectibles in the sky
  const [items, setItems] = useState<SkyCollectible[]>([]);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const keysPressedRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  const isBoy = profile.avatarType === 'guest_boy';
  const avatarImage = isBoy 
    ? '/src/assets/images/guest_boy_avatar_1792080024725.jpg'
    : '/src/assets/images/guest_girl_avatar_1792080024600.jpg';

  // Sound horn on bus ride start
  useEffect(() => {
    sound.playBattleBusHorn();

    // Spawn sky items
    const generated: SkyCollectible[] = [];
    for (let i = 0; i < 28; i++) {
      const types: ('star' | 'slurp' | 'storm' | 'coin')[] = ['star', 'coin', 'coin', 'slurp', 'storm'];
      const pick = types[Math.floor(Math.random() * types.length)];
      generated.push({
        id: i,
        x: 15 + Math.random() * 70,
        y: 80 - (i * 3.2), // distributed along the descent
        type: pick,
        collected: false,
      });
    }
    setItems(generated);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = true;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameState === 'bus_ride') {
          handleJumpFromBus();
        } else if (gameState === 'skydiving') {
          handleToggleGlider();
        } else if (gameState === 'gliding') {
          handleToggleGlider();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressedRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressedRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main game physics loop
  useEffect(() => {
    if (gameState !== 'skydiving' && gameState !== 'gliding') return;

    let animId: number;
    lastUpdateTimeRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTimeRef.current) / 1000, 0.05);
      lastUpdateTimeRef.current = now;

      // Update lateral position
      const moveSpeed = gameState === 'skydiving' ? 38 : 28; // % per second
      setPlayerX((prev) => {
        let next = prev;
        if (keysPressedRef.current.left) next -= moveSpeed * dt;
        if (keysPressedRef.current.right) next += moveSpeed * dt;
        return Math.max(10, Math.min(90, next));
      });

      // Update descent rate
      const fallSpeed = gameState === 'skydiving' ? 140 : 55; // meters per second
      setAltitude((prev) => {
        const nextAlt = prev - fallSpeed * dt;
        if (nextAlt <= 0) {
          // Player has hit the ground!
          triggerLanding();
          return 0;
        }
        return nextAlt;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Check collision with sky items
  useEffect(() => {
    if (gameState !== 'skydiving' && gameState !== 'gliding') return;

    // Current relative y-level (from 0 to 100)
    const currentYPct = (altitude / 1000) * 100;

    setItems((prevItems) => {
      let scoreGain = 0;
      let healthDamage = 0;

      const updated = prevItems.map((item) => {
        if (item.collected) return item;
        const dx = Math.abs(item.x - playerX);
        const dy = Math.abs(item.y - (100 - currentYPct));

        // Hit test
        if (dx < 7 && dy < 6) {
          if (item.type === 'star') {
            scoreGain += 100;
            sound.playCollect();
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
          } else if (item.type === 'coin') {
            scoreGain += 50;
            sound.playCollect();
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
          } else if (item.type === 'slurp') {
            scoreGain += 75;
            sound.playHeal();
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 40, 20]);
          } else if (item.type === 'storm') {
            healthDamage += 25;
            sound.playOof();
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(80);
          }
          return { ...item, collected: true };
        }
        return item;
      });

      if (scoreGain > 0) {
        setScore((s) => s + scoreGain);
        setStreak((st) => st + 1);
      }
      if (healthDamage > 0) {
        setHealth((h) => {
          const next = h - healthDamage;
          if (next <= 0) {
            setGameState('game_over');
          }
          return Math.max(0, next);
        });
      }

      return updated;
    });
  }, [altitude, playerX, gameState]);

  const handleJumpFromBus = () => {
    sound.playGliderDeploy();
    setGameState('skydiving');
  };

  const handleToggleGlider = () => {
    if (gameState === 'skydiving') {
      sound.playGliderDeploy();
      setGameState('gliding');
    } else if (gameState === 'gliding') {
      sound.playJump();
      setGameState('skydiving');
    }
  };

  const triggerLanding = () => {
    let loc = 'Tilted Towers Street Ground';
    let bonus = 200;

    // Check where they landed based on playerX
    if (playerX >= 44 && playerX <= 56) {
      loc = 'TOP OF TILTED CLOCK TOWER! 🏆';
      bonus = 1000;
      sound.playPlayAsGuest();
    } else if (playerX >= 25 && playerX <= 42) {
      loc = 'Trump Tower Rooftop';
      bonus = 600;
      sound.playHeal();
    } else if (playerX >= 58 && playerX <= 75) {
      loc = 'No Sweat Insurance HQ Roof';
      bonus = 500;
      sound.playHeal();
    } else {
      sound.playCollect();
    }

    setLandedLocation(loc);
    setScore((s) => {
      const finalScore = s + bonus;
      return finalScore;
    });
    setTimeout(() => {
      onVictory(score + bonus);
    }, 0);
    setGameState('landed');
  };

  const resetGame = () => {
    sound.playClick();
    setGameState('bus_ride');
    setPlayerX(50);
    setAltitude(1000);
    setScore(0);
    setHealth(100);
    setStreak(0);
    setLandedLocation('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Game Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Game</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-sky-400 font-display">
              Fortnite: Battle Bus (Tilted Drop)
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
              <span>· Playing as 👑 Guest 666</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded font-black">RARE LEGENDARY EDITION</span>
            </span>
          </div>
        </div>

        {/* In-game HUD metrics */}
        <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm">
          {/* Health Bar */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-400 tabular-nums">{health} HP</span>
          </div>

          {/* Altitude */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-cyan-300 tabular-nums">{Math.round(altitude)}m</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/40 text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold tabular-nums">{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Main Playfield / Sky Viewport */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Tilted Towers Background */}
        <img
          src="/src/assets/images/tilted_towers_backdrop_1792080023303.jpg"
          alt="Tilted Towers"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          style={{
            transform: `scale(${1 + (1000 - altitude) / 1800}) translateY(${((1000 - altitude) / 1000) * 15}%)`,
          }}
        />

        {/* Dynamic Wind Lines & Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-sky-950/40 pointer-events-none" />

        {/* Target landing markers at bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-center pointer-events-none">
          <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-bold">
            Trump Tower (600 pts)
          </div>
          <div className="bg-amber-500/90 text-slate-950 font-black rounded-lg px-3 py-1.5 text-xs shadow-lg shadow-amber-500/30 animate-bounce">
            🎯 CLOCK TOWER TOP (1000 PTS!)
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-bold">
            No Sweat HQ (500 pts)
          </div>
        </div>

        {/* Floating sky collectibles */}
        {(gameState === 'skydiving' || gameState === 'gliding') &&
          items.map((item) => {
            if (item.collected) return null;
            // Screen relative position
            const itemRelativeY = item.y - ((1000 - altitude) / 1000) * 80;
            if (itemRelativeY < -10 || itemRelativeY > 110) return null;

            return (
              <div
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${item.x}%`,
                  top: `${itemRelativeY}%`,
                }}
              >
                {item.type === 'star' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/50 animate-pulse text-xs">
                    ★
                  </div>
                )}
                {item.type === 'coin' && (
                  <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-yellow-500 text-yellow-900 flex items-center justify-center font-black text-[10px] shadow-md">
                    V
                  </div>
                )}
                {item.type === 'slurp' && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-400 text-cyan-950 flex items-center justify-center font-bold text-[10px] shadow-lg shadow-cyan-400/50">
                    +HP
                  </div>
                )}
                {item.type === 'storm' && (
                  <div className="w-9 h-9 rounded-full bg-purple-600/90 text-purple-200 flex items-center justify-center font-black shadow-lg shadow-purple-600/50 animate-bounce">
                    <Zap className="w-5 h-5 text-yellow-300" />
                  </div>
                )}
              </div>
            );
          })}

        {/* Phase 1: High Altitude Battle Bus Cruising */}
        {gameState === 'bus_ride' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="relative mb-6">
              {/* Battle Bus Image Artwork */}
              <div className="w-72 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-sky-400/40">
                <img
                  src="/src/assets/images/battle_bus_game_art_1792080023205.jpg"
                  alt="Fortnite Battle Bus"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Guest Passenger Badge */}
              <div className="absolute -bottom-3 -right-3 flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border-2 border-amber-400 rounded-xl shadow-lg">
                <img src={avatarImage} alt="Guest 666" className="w-6 h-6 rounded-lg object-cover" />
                <span className="text-xs font-black text-amber-300">👑 Guest 666</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded font-black">RARE</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight drop-shadow-md">
              BATTLE BUS CRUISING OVER TILTED
            </h2>
            <p className="text-sm text-sky-200 mt-1 max-w-md drop-shadow">
              Altitude: 1,000 meters. Prepare to skydive directly into Tilted Towers!
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleJumpFromBus}
                className="blox-btn-blue px-8 py-4 rounded-2xl font-black text-lg tracking-wider text-white shadow-xl shadow-sky-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Wind className="w-6 h-6" />
                <span>JUMP FROM BUS (SPACE)</span>
              </button>

              <button
                type="button"
                onClick={() => sound.playBattleBusHorn()}
                className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition-colors"
              >
                HONK HORN 📢
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Skydive & Glider Active Avatar */}
        {(gameState === 'skydiving' || gameState === 'gliding') && (
          <div
            className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 pointer-events-none z-30"
            style={{ left: `${playerX}%` }}
          >
            {/* Umbrella Glider on top if deployed */}
            {gameState === 'gliding' && (
              <div className="relative -top-4 mx-auto w-24 h-12 flex items-center justify-center animate-bounce">
                <svg viewBox="0 0 100 50" className="w-full h-full filter drop-shadow-lg">
                  {/* Umbrella Canopy */}
                  <path
                    d="M 5 45 Q 50 -10 95 45 Q 75 35 50 38 Q 25 35 5 45 Z"
                    fill="#0284c7"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {/* Ribs */}
                  <line x1="50" y1="2" x2="50" y2="46" stroke="#e2e8f0" strokeWidth="2" />
                  <line x1="25" y1="18" x2="50" y2="46" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="75" y1="18" x2="50" y2="46" stroke="#94a3b8" strokeWidth="1" />
                </svg>
              </div>
            )}

            {/* Guest Avatar Character Diving */}
            <div className="relative flex flex-col items-center">
              {/* Wind trails */}
              {gameState === 'skydiving' && (
                <div className="absolute -top-12 flex gap-3 text-cyan-300/80 opacity-75 animate-pulse">
                  <div className="w-0.5 h-8 bg-cyan-300 blur-[0.5px]" />
                  <div className="w-0.5 h-12 bg-white blur-[0.5px]" />
                  <div className="w-0.5 h-8 bg-cyan-300 blur-[0.5px]" />
                </div>
              )}

              {/* Avatar Box Head & Body with Gold Glow */}
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-2xl bg-sky-600">
                <img
                  src={avatarImage}
                  alt="Guest 666"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 px-1 bg-blue-700 text-[9px] font-black text-white">
                  R
                </div>
              </div>

              {/* Guest name tag above head with Crown & RARE LEGENDARY EDITION */}
              <div className="mt-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-md text-[10px] font-black whitespace-nowrap shadow-md flex items-center gap-1 border border-yellow-200">
                <span>👑 Guest 666</span>
                <span className="text-[8px] bg-slate-950 text-amber-300 px-1 rounded">RARE</span>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Victory Landing Screen */}
        {gameState === 'landed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 bg-slate-950/85 backdrop-blur-md">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-amber-400 font-display tracking-tight">
              #1 VICTORY ROYALE!
            </h2>
            <p className="text-base text-slate-200 mt-1 font-semibold">
              Landed at: <span className="text-sky-300">{landedLocation}</span>
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-6 text-center max-w-sm w-full">
              <div>
                <div className="text-xs text-slate-400">Total Score</div>
                <div className="text-xl font-bold font-mono text-amber-300">{score}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Remaining HP</div>
                <div className="text-xl font-bold font-mono text-emerald-400">{health}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Guest Role</div>
                <div className="text-xs font-bold text-sky-400 mt-1">Guest Badge</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="blox-btn-blue px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                type="button"
                onClick={onExit}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm text-white border border-slate-700 transition-colors"
              >
                Back to Hub
              </button>
            </div>
          </div>
        )}

        {/* Phase 4: Game Over / Knocked by Storm */}
        {gameState === 'game_over' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 bg-slate-950/90 backdrop-blur-md">
            <div className="text-5xl font-black text-rose-500 font-display mb-2">
              OOF!
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Taken Down by Storm Lightning
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Dodge the purple thunderclouds on your next drop to preserve your shield!
            </p>

            <button
              type="button"
              onClick={resetGame}
              className="blox-btn-blue px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Drop Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls & Glider Action Bar */}
      {(gameState === 'skydiving' || gameState === 'gliding') && (
        <div className="relative z-20 flex items-center justify-between p-4 bg-slate-900/90 border-t border-slate-800">
          {/* Steer Left Button */}
          <button
            type="button"
            onPointerDown={() => { keysPressedRef.current.left = true; }}
            onPointerUp={() => { keysPressedRef.current.left = false; }}
            onPointerLeave={() => { keysPressedRef.current.left = false; }}
            className="w-16 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center active:scale-95 transition-all text-slate-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Toggle Glider CTA */}
          <button
            type="button"
            onClick={handleToggleGlider}
            className={`px-6 h-14 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
              gameState === 'gliding'
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'blox-btn-blue text-white'
            }`}
          >
            <Wind className="w-5 h-5" />
            <span>{gameState === 'gliding' ? 'DIVE FASTER' : 'DEPLOY GLIDER'}</span>
          </button>

          {/* Steer Right Button */}
          <button
            type="button"
            onPointerDown={() => { keysPressedRef.current.right = true; }}
            onPointerUp={() => { keysPressedRef.current.right = false; }}
            onPointerLeave={() => { keysPressedRef.current.right = false; }}
            className="w-16 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center active:scale-95 transition-all text-slate-200"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
