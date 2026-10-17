import React, { useState } from 'react';
import { generateQRCodeSVG } from '../utils/qrCode';
import { sound } from '../utils/audio';
import { 
  X, Smartphone, Copy, Check, QrCode, Monitor, 
  ExternalLink, Sparkles, ShieldCheck, ArrowRight, Share2 
} from 'lucide-react';

interface PlayOnPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPhoneFrameActive: boolean;
  onTogglePhoneFrame: () => void;
}

export const PlayOnPhoneModal: React.FC<PlayOnPhoneModalProps> = ({
  isOpen,
  onClose,
  isPhoneFrameActive,
  onTogglePhoneFrame,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Use active URL or fallback shared URL
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://ais-pre-oet5ma5hxi6ultfpmzbisg-247217097930.asia-southeast1.run.app';

  const qrSvg = generateQRCodeSVG(currentUrl, 220);

  const handleCopyLink = () => {
    sound.playCollect();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight text-white">
                Play on Mobile Phone
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                Scan QR code with your phone camera or simulate phone screen
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* QR Code Centerpiece */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-white rounded-3xl border-2 border-slate-200/90 shadow-lg relative group">
              {/* QR Code SVG */}
              <div 
                className="w-48 h-48 sm:w-52 sm:h-52"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            </div>

            <div className="mt-3 text-xs font-bold text-slate-800">
              Point your iPhone or Android camera to scan
            </div>
            <div className="text-[11px] text-slate-500 max-w-xs mt-0.5">
              Opens BloxHub directly on your mobile browser with full touch controls and 0 account required!
            </div>
          </div>

          {/* Quick Actions: Copy Link & Phone Simulator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 active:scale-98 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Phone Link</span>
                </>
              )}
            </button>

            {/* Toggle Phone Frame Simulator */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onTogglePhoneFrame();
                onClose();
              }}
              className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                isPhoneFrameActive
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4 text-sky-600" />
              <span>{isPhoneFrameActive ? 'Exit Phone View' : 'Try Phone View'}</span>
            </button>
          </div>

          {/* Mobile Highlights */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Mobile Phone Features</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span><strong>Touch Controls:</strong> On-screen thumb buttons for skydive and glider</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span><strong>No App Install:</strong> Runs instantly in mobile Safari &amp; Chrome</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span><strong>Fullscreen Mode:</strong> Tap "Share" &rarr; "Add to Home Screen" on iOS</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
