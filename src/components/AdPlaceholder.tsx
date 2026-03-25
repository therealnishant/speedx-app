import React from 'react';
import { Crown } from 'lucide-react';

interface AdPlaceholderProps {
  type: 'banner' | 'interstitial';
  onClose?: () => void;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, onClose }) => {
  if (type === 'banner') {
    return (
      <div className="w-full h-14 bg-zinc-900 border-y border-white/5 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-transparent to-neon-purple/5" />
        <div className="flex items-center gap-3 z-10">
          <div className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-bold text-white/40 uppercase border border-white/10">
            Ad
          </div>
          <span className="text-xs text-white/60 font-medium">
            Upgrade to <span className="text-neon-blue font-bold">SpeedX Premium</span> to remove ads
          </span>
          <Crown size={12} className="text-yellow-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
      <div className="absolute top-8 right-8">
        <button 
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-white/10 text-white/60 text-sm font-bold"
        >
          Skip Ad
        </button>
      </div>
      
      <div className="w-full max-w-xs aspect-video bg-zinc-900 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-neon-blue/20 flex items-center justify-center border border-neon-blue/30">
          <Crown size={32} className="text-neon-blue" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-display mb-1">SpeedX Premium</h3>
          <p className="text-white/40 text-sm">Unlock custom themes and remove all advertisements.</p>
        </div>
        <button className="w-full py-3 rounded-xl bg-neon-blue text-black font-bold shadow-[0_0_15px_rgba(0,242,255,0.4)]">
          Go Premium
        </button>
      </div>
      
      <span className="mt-8 text-white/20 text-[10px] uppercase tracking-widest font-bold">
        Advertisement
      </span>
    </div>
  );
};
