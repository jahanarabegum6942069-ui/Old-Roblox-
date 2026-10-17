import React, { useState, useEffect, useRef } from 'react';
import { GuestProfile } from '../types';
import { sound } from '../utils/audio';
import { 
  X, Smartphone, ShieldCheck, CheckCircle2, ArrowRight, 
  RefreshCw, MessageSquare, KeyRound, Sparkles, AlertCircle 
} from 'lucide-react';

interface PhoneCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: GuestProfile;
  onPhoneVerified: (phone: string, quickCode: string) => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
];

export const PhoneCodeModal: React.FC<PhoneCodeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onPhoneVerified,
}) => {
  const [activeTab, setActiveTab] = useState<'sms' | 'quick_login'>('sms');
  
  // SMS Mode state
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber || '');
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [generatedSmsCode, setGeneratedSmsCode] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [smsBannerVisible, setSmsBannerVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Quick Login Mode state
  const [deviceQuickCode, setDeviceQuickCode] = useState<string>('BLX-' + Math.floor(1000 + Math.random() * 9000));
  const [enteredQuickCode, setEnteredQuickCode] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  if (!isOpen) return null;

  const handleSendSmsCode = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 7) {
      setErrorMsg('Please enter a valid phone number');
      sound.playOof();
      return;
    }

    setErrorMsg('');
    sound.playClick();
    
    // Generate 6-digit random code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedSmsCode(code);
    setSmsSent(true);
    setSmsBannerVisible(true);
    setResendCountdown(30);

    // Focus first OTP box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const updated = [...enteredOtp];
    updated[index] = digit;
    setEnteredOtp(updated);
    setErrorMsg('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    if (!generatedSmsCode) return;
    sound.playCollect();
    const digits = generatedSmsCode.split('');
    setEnteredOtp(digits);
    setErrorMsg('');
  };

  const handleVerifyOtp = () => {
    const entered = enteredOtp.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the phone code');
      sound.playOof();
      return;
    }

    if (entered !== generatedSmsCode) {
      setErrorMsg('Invalid code. Please check your SMS or click Auto-fill.');
      sound.playOof();
      return;
    }

    // Success!
    sound.playPlayAsGuest();
    setSuccessMsg('Phone verified successfully! Added Phone Verified Guest badge.');
    const fullPhone = `${countryCode} ${phoneNumber}`;
    onPhoneVerified(fullPhone, deviceQuickCode);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleVerifyQuickLoginCode = () => {
    if (enteredQuickCode.trim().length < 4) {
      setErrorMsg('Please enter a valid 6-character phone quick code');
      sound.playOof();
      return;
    }

    sound.playPlayAsGuest();
    setSuccessMsg(`Device paired with code: ${enteredQuickCode.toUpperCase()}!`);
    onPhoneVerified(`Phone Linked (${enteredQuickCode.toUpperCase()})`, enteredQuickCode.toUpperCase());

    setTimeout(() => {
      onClose();
    }, 1200);
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
        <div className="p-6 pb-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight text-white">
                Phone Code Verification
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                Verify mobile phone or link device with quick 6-digit code
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Control: SMS Phone Code vs Quick Login Code */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('sms');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'sms'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMS Phone Code
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveTab('quick_login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'quick_login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Device Quick Code
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-4 space-y-5">
          {/* Simulated SMS Notification Banner */}
          {smsBannerVisible && generatedSmsCode && (
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 shadow-xs animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-sky-900">
                      Incoming SMS from BloxHub:
                    </div>
                    <div className="text-xs text-sky-800 font-medium mt-0.5">
                      Your 6-digit verification code is <strong className="font-mono text-sm tracking-wider text-sky-950 bg-sky-100 px-1 rounded">{generatedSmsCode}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="px-2.5 py-1 text-xs font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700 active:scale-95 transition-all shadow-xs shrink-0"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SMS Phone Code */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Enter Mobile Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Picker */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={smsSent}
                    className="h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none font-medium text-slate-800"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.country})
                      </option>
                    ))}
                  </select>

                  {/* Phone input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 019-2834"
                    disabled={smsSent}
                    className="flex-1 h-11 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {!smsSent ? (
                <button
                  type="button"
                  onClick={handleSendSmsCode}
                  className="blox-btn-blue w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Send 6-Digit Phone Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-600">
                        Enter 6-Digit Phone Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSmsSent(false);
                          setEnteredOtp(['', '', '', '', '', '']);
                        }}
                        className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
                      >
                        Change number
                      </button>
                    </div>

                    {/* 6 OTP Input Boxes */}
                    <div className="grid grid-cols-6 gap-2 sm:gap-3">
                      {enteredOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { inputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-full h-12 text-center text-lg font-bold font-mono bg-slate-50 border-2 border-slate-300 focus:border-sky-500 rounded-xl focus:outline-none transition-colors text-slate-900"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend button & countdown */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Didn't receive SMS?</span>
                    {resendCountdown > 0 ? (
                      <span className="font-mono text-slate-400">Resend in {resendCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendSmsCode}
                        className="text-sky-600 hover:text-sky-800 font-bold transition-colors"
                      >
                        Resend Phone Code
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="blox-btn-green w-full h-12 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify &amp; Confirm Phone</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Device Quick Login Code */}
          {activeTab === 'quick_login' && (
            <div className="space-y-5">
              {/* Box 1: Your Device Code */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500 font-medium mb-1">
                  Your Phone Quick Link Code
                </div>
                <div className="text-2xl font-black font-mono tracking-widest text-sky-700 my-1">
                  {deviceQuickCode}
                </div>
                <div className="text-[11px] text-slate-400">
                  Enter this 6-character code on another mobile device or tablet to sync your Guest session.
                </div>
              </div>

              {/* Box 2: Enter code from another phone */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Or Enter Code from Another Phone
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={enteredQuickCode}
                    onChange={(e) => setEnteredQuickCode(e.target.value.toUpperCase())}
                    placeholder="e.g. BLX-774"
                    maxLength={10}
                    className="flex-1 h-11 px-3.5 text-sm uppercase font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-sky-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyQuickLoginCode}
                    className="blox-btn-blue px-5 h-11 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Privacy & Guest Note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              Guest accounts remain 100% anonymous &amp; free
            </span>
            <span>No password needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
