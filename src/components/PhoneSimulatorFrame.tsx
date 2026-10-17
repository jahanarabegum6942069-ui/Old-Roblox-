import React from 'react';
import { Smartphone, X, RotateCcw, Wifi, Battery, Signal } from 'lucide-react';
import { sound } from '../utils/audio';

interface PhoneSimulatorFrameProps {
  children: React.ReactNode;
  onExitPhoneFrame: () => void;
}

export const PhoneSimulatorFrame: React.FC<PhoneSimulatorFrameProps> = ({
  children,
  onExitPhoneFrame,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
      {/* Top Banner Control Bar */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-slate-200">Phone Simulator View</span>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onExitPhoneFrame();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Phone View</span>
        </button>
      </div>

      {/* Realistic Mobile Phone Mockup Device */}
      <div className="relative w-full max-w-[390px] h-[810px] max-h-[92vh] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Mobile Phone Status Bar */}
        <div className="relative z-40 flex items-center justify-between px-6 pt-1 pb-1 text-[11px] font-bold text-slate-800 bg-white select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <div className="w-5 h-2.5 rounded-xs border border-slate-700 p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="relative flex-1 w-full bg-white rounded-b-[36px] overflow-y-auto overflow-x-hidden flex flex-col">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 z-50 w-32 h-1 bg-white/70 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
