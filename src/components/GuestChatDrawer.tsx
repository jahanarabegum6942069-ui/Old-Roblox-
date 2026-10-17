import React, { useState } from 'react';
import { ChatMessage, GuestProfile } from '../types';
import { sound } from '../utils/audio';
import { Send, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';

interface GuestChatDrawerProps {
  profile: GuestProfile;
}

const PRESET_PHRASES = [
  'Hi everyone! 👋',
  'Let\'s drop at Tilted Towers! 🪂',
  'Meet me at the Battle Bus!',
  'The pets at Animal Hospital are so cute! 🐶',
  'Oof! 😂',
  'Good game! GG 🏆',
  'Nice avatar! Love the blue R shirt!',
  'Can someone help me?',
  'Follow me!',
];

export const GuestChatDrawer: React.FC<GuestChatDrawerProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Guest 9021',
      avatarType: 'guest_boy',
      role: 'Guest',
      text: 'Hello everyone! Ready for Fortnite Battle Bus?',
      timestamp: 'Just now',
    },
    {
      id: '2',
      sender: 'Guest 4410',
      avatarType: 'guest_girl',
      role: 'Guest',
      text: 'I just healed Buster the puppy in Animal Hospital! ❤️',
      timestamp: '1m ago',
    },
  ]);

  const handleSendPreset = (text: string) => {
    sound.playClick();
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: profile.id,
      avatarType: profile.avatarType,
      role: 'Guest',
      text: text,
      timestamp: 'Just now',
      isSelf: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated reply from other guest acknowledging the legendary Guest 666
    setTimeout(() => {
      sound.playCollect();
      const replies = [
        'OMG it\'s the real Guest 666! 👑',
        'Woah, the Rare Legendary Edition Guest 666 is here!',
        'GG Guest 666! Let\'s drop Clock Tower!',
        'I see the legendary gold crown on Guest 666! ✨',
      ];
      const botPick = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: `Guest ${Math.floor(1000 + Math.random() * 8999)}`,
          avatarType: Math.random() > 0.5 ? 'guest_boy' : 'guest_girl',
          role: 'Guest',
          text: botPick,
          timestamp: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <span>Guest Safe Quick-Chat</span>
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs rounded-full shadow-xs">
              👑 Guest 666
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Pre-approved friendly chat phrases safe for all guests
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>RARE LEGENDARY EDITION</span>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm min-h-[360px] max-h-[460px] overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const isSelf = msg.isSelf;
          const avatarSrc =
            msg.avatarType === 'guest_boy'
              ? '/src/assets/images/guest_boy_avatar_1792080024725.jpg'
              : '/src/assets/images/guest_girl_avatar_1792080024600.jpg';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isSelf ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl overflow-hidden shrink-0 border bg-slate-100 ${
                isSelf ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-200'
              }`}>
                <img src={avatarSrc} alt={msg.sender} className="w-full h-full object-cover" />
              </div>

              <div
                className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs ${
                  isSelf
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 rounded-tr-xs font-semibold shadow-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold">
                  <span className={isSelf ? 'text-slate-950 font-black' : 'text-slate-900'}>
                    {msg.sender}
                  </span>
                  <span className={`text-[10px] ${isSelf ? 'text-amber-950 font-extrabold' : 'text-slate-500'}`}>
                    {isSelf ? '👑 [RARE LEGENDARY EDITION]' : '[Role: Guest]'}
                  </span>
                </div>
                <div className="text-sm font-medium">{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Phrases Keyboard */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Tap Quick-Chat Phrase to Send:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {PRESET_PHRASES.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => handleSendPreset(phrase)}
              className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-800 hover:border-sky-300 border border-slate-200 text-xs font-semibold text-slate-700 transition-all active:scale-98"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
