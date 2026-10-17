import React, { useState } from 'react';
import { GuestProfile } from '../../types';
import { sound } from '../../utils/audio';
import { 
  ArrowLeft, Heart, Stethoscope, Sparkles, Award, 
  RotateCcw, CheckCircle2, Bone, Droplets, Bandage 
} from 'lucide-react';

interface AnimalHospitalGameProps {
  profile: GuestProfile;
  onExit: () => void;
  onVictory: (healedPetsCount: number) => void;
}

interface PetPatient {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Bunny';
  breed: string;
  condition: string;
  happiness: number; // 0 to 100
  needs: {
    stethoscope: boolean;
    cleanse: boolean;
    bandage: boolean;
    treat: boolean;
    cuddle: boolean;
  };
  icon: string;
}

const INITIAL_PETS: PetPatient[] = [
  {
    id: 'buster',
    name: 'Buster',
    species: 'Dog',
    breed: 'Golden Retriever Pup',
    condition: 'Tired puppy needs checkup & minor paw scrape wrapped',
    happiness: 30,
    needs: { stethoscope: false, cleanse: false, bandage: false, treat: false, cuddle: false },
    icon: '🐶',
  },
  {
    id: 'whiskers',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Tabby Kitten',
    condition: 'Hungry kitten needs heart listen & delicious fish snack',
    happiness: 40,
    needs: { stethoscope: false, cleanse: false, bandage: false, treat: false, cuddle: false },
    icon: '🐱',
  },
  {
    id: 'barnaby',
    name: 'Barnaby',
    species: 'Bunny',
    breed: 'Fluffy Angora Lop',
    condition: 'Little bunny needs ear check, bubbly grooming & love',
    happiness: 25,
    needs: { stethoscope: false, cleanse: false, bandage: false, treat: false, cuddle: false },
    icon: '🐰',
  },
];

export const AnimalHospitalGame: React.FC<AnimalHospitalGameProps> = ({
  profile,
  onExit,
  onVictory,
}) => {
  const [patients, setPatients] = useState<PetPatient[]>(INITIAL_PETS);
  const [selectedPetId, setSelectedPetId] = useState<string>('buster');
  const [activeTool, setActiveTool] = useState<'stethoscope' | 'cleanse' | 'bandage' | 'treat' | 'cuddle'>('stethoscope');
  const [actionFeedback, setActionFeedback] = useState<string>('');
  const [healedCount, setHealedCount] = useState<number>(0);

  const currentPet = patients.find((p) => p.id === selectedPetId) || patients[0];
  const isFullyHealed = Object.values(currentPet.needs).every(Boolean);

  const applyTreatment = (tool: 'stethoscope' | 'cleanse' | 'bandage' | 'treat' | 'cuddle') => {
    setActiveTool(tool);

    if (currentPet.needs[tool]) {
      setActionFeedback(`Already completed ${tool}! Try another step.`);
      sound.playClick();
      return;
    }

    // Play appropriate sound
    if (tool === 'stethoscope') {
      sound.playHeal();
      setActionFeedback(`❤️ Steady healthy heartbeat: 110 BPM! ${currentPet.name} feels relaxed.`);
    } else if (tool === 'cleanse') {
      sound.playGliderDeploy();
      setActionFeedback(`✨ Gentle soothing antiseptic applied. Clean and sparkling!`);
    } else if (tool === 'bandage') {
      sound.playCollect();
      setActionFeedback(`🩹 Cozy blue guest bandage applied with love!`);
    } else if (tool === 'treat') {
      sound.playBark();
      setActionFeedback(`🍖 Yum! ${currentPet.name} enjoyed the special nutritious treat.`);
    } else if (tool === 'cuddle') {
      sound.playBark();
      setActionFeedback(`🥰 Gentle petting! ${currentPet.name} is super happy & wagging!`);
    }

    setPatients((prev) =>
      prev.map((pet) => {
        if (pet.id !== currentPet.id) return pet;
        const newNeeds = { ...pet.needs, [tool]: true };
        const newHappiness = Math.min(100, pet.happiness + 15);
        const allDone = Object.values(newNeeds).every(Boolean);

        if (allDone && !Object.values(pet.needs).every(Boolean)) {
          sound.playPlayAsGuest();
          setHealedCount((c) => {
            const next = c + 1;
            return next;
          });
          setTimeout(() => {
            onVictory(healedCount + 1);
          }, 0);
        }

        return {
          ...pet,
          happiness: allDone ? 100 : newHappiness,
          needs: newNeeds,
        };
      })
    );
  };

  const isBoy = profile.avatarType === 'guest_boy';
  const avatarImage = isBoy 
    ? '/src/assets/images/guest_boy_avatar_1792080024725.jpg'
    : '/src/assets/images/guest_girl_avatar_1792080024600.jpg';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-100 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 h-14 bg-white/95 text-slate-900 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Clinic</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-sky-700 font-display">
              Animal Hospital: Rescue &amp; Pet Care
            </span>
            <span className="text-xs text-amber-800 font-bold flex items-center gap-1">
              · Attending Vet: 👑 Guest 666 [RARE LEGENDARY EDITION]
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span className="font-bold">{healedCount} Pets Healed</span>
          </div>
        </div>
      </div>

      {/* Main Clinic Layout */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-y-auto">
        {/* Left: Treatment Room View */}
        <div className="relative flex-1 min-h-[340px] flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Clinic Background Image */}
          <img
            src="/src/assets/images/animal_hospital_art_1792080024051.jpg"
            alt="Animal Hospital Reception & Treatment Room"
            className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/20" />

          {/* Central Pet Exam Table */}
          <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 shadow-2xl border border-white/80 text-center animate-in zoom-in-95 duration-200">
            {/* Top Patient Badge */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-left">
                <span className="text-3xl">{currentPet.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">
                    {currentPet.name}
                  </h3>
                  <div className="text-xs text-slate-500">{currentPet.breed}</div>
                </div>
              </div>

              {/* Status Indicator */}
              {isFullyHealed ? (
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Healed &amp; Happy!</span>
                </div>
              ) : (
                <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Exam in Progress
                </div>
              )}
            </div>

            {/* Happiness Progress Bar */}
            <div className="mb-4 text-left">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-600">Patient Comfort &amp; Health</span>
                <span className="text-sky-700 font-mono">{currentPet.happiness}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${currentPet.happiness}%` }}
                />
              </div>
            </div>

            {/* Condition description */}
            <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4">
              "{currentPet.condition}"
            </p>

            {/* Action Feedback Toast */}
            {actionFeedback && (
              <div className="p-2.5 mb-4 rounded-xl bg-sky-50 text-sky-800 text-xs font-medium border border-sky-200 animate-in fade-in">
                {actionFeedback}
              </div>
            )}

            {/* Guest Attending Vet Info with Gold Crown & RARE LEGENDARY EDITION */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <img src={avatarImage} alt="Dr. Guest 666" className="w-5 h-5 rounded-md object-cover ring-2 ring-amber-400" />
              <span>Attending Vet: <strong className="text-amber-950 font-black">👑 Guest 666</strong> (Role: Guest · <span className="text-amber-700 font-extrabold">RARE LEGENDARY EDITION</span>)</span>
            </div>
          </div>
        </div>

        {/* Right: Medical Tools & Patient Switcher */}
        <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Veterinary Medical Kit
            </div>

            {/* Tool Action Buttons */}
            <div className="space-y-2 mb-6">
              {/* Tool 1: Stethoscope */}
              <button
                type="button"
                onClick={() => applyTreatment('stethoscope')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  currentPet.needs.stethoscope
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">1. Stethoscope Check</div>
                    <div className="text-[11px] text-slate-400">Listen to heartbeat rhythm</div>
                  </div>
                </div>
                {currentPet.needs.stethoscope && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Tool 2: Antiseptic Cleanse */}
              <button
                type="button"
                onClick={() => applyTreatment('cleanse')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  currentPet.needs.cleanse
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">2. Cleansing Spray</div>
                    <div className="text-[11px] text-slate-400">Clean fur &amp; minor scrapes</div>
                  </div>
                </div>
                {currentPet.needs.cleanse && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Tool 3: Soft Bandage */}
              <button
                type="button"
                onClick={() => applyTreatment('bandage')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  currentPet.needs.bandage
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Bandage className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">3. Healing Bandage</div>
                    <div className="text-[11px] text-slate-400">Apply cute blue wrap</div>
                  </div>
                </div>
                {currentPet.needs.bandage && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Tool 4: Nutritious Treat */}
              <button
                type="button"
                onClick={() => applyTreatment('treat')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  currentPet.needs.treat
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Bone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">4. Yummy Treat</div>
                    <div className="text-[11px] text-slate-400">Nutritious snack reward</div>
                  </div>
                </div>
                {currentPet.needs.treat && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Tool 5: Cuddle & Brush */}
              <button
                type="button"
                onClick={() => applyTreatment('cuddle')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  currentPet.needs.cuddle
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">5. Soft Brush &amp; Cuddle</div>
                    <div className="text-[11px] text-slate-400">Gentle calming affection</div>
                  </div>
                </div>
                {currentPet.needs.cuddle && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Waiting Room Patients */}
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Waiting Patients
            </div>
            <div className="grid grid-cols-3 gap-2">
              {patients.map((pet) => {
                const healed = Object.values(pet.needs).every(Boolean);
                const active = pet.id === selectedPetId;
                return (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedPetId(pet.id);
                      setActionFeedback(`Now treating ${pet.name}!`);
                    }}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      active
                        ? 'bg-sky-600 text-white border-sky-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-xl mb-0.5">{pet.icon}</div>
                    <div className="text-[11px] font-bold truncate">{pet.name}</div>
                    <div className="text-[9px] opacity-80">{healed ? 'Done ✓' : `${pet.happiness}%`}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <button
              type="button"
              onClick={onExit}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Exit to Game Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
