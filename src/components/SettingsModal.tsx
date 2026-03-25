import React from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, RotateCcw, Ruler, Zap, Palette, Bike, Car } from 'lucide-react';
import { AppSettings } from '@/src/types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onReset, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-8 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold font-display mb-8">Settings</h2>

        <div className="flex flex-col gap-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ruler size={18} className="text-white/40" />
              <span className="text-sm font-medium">Speed Unit</span>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {(['KM/H', 'MPH'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => onUpdate({ unit: u })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    settings.unit === u ? 'bg-neon-blue text-black shadow-lg' : 'text-white/40'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.mode === 'bike' ? <Bike size={18} className="text-white/40" /> : <Car size={18} className="text-white/40" />}
              <span className="text-sm font-medium">Travel Mode</span>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              {(['bike', 'car'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdate({ mode: m })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all capitalize ${
                    settings.mode === m ? 'bg-neon-blue text-black shadow-lg' : 'text-white/40'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Limit */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={18} className="text-white/40" />
                <span className="text-sm font-medium">Speed Limit</span>
              </div>
              <span className="text-sm font-bold text-neon-blue">{settings.speedLimit} {settings.unit}</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="200" 
              step="5"
              value={settings.speedLimit}
              onChange={(e) => onUpdate({ speedLimit: parseInt(e.target.value) })}
              className="w-full accent-neon-blue"
            />
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 size={18} className="text-white/40" /> : <VolumeX size={18} className="text-white/40" />}
              <span className="text-sm font-medium">Voice Alerts</span>
            </div>
            <button 
              onClick={() => onUpdate({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-neon-blue' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Theme Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette size={18} className="text-white/40" />
              <span className="text-sm font-medium">Neon Theme</span>
            </div>
            <div className="flex gap-2">
              {(['default', 'cyan', 'green'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdate({ theme: t })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    settings.theme === t ? 'border-white' : 'border-transparent'
                  } ${
                    t === 'default' ? 'bg-neon-blue' : t === 'cyan' ? 'bg-neon-cyan' : 'bg-neon-green'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* Reset Button */}
          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <RotateCcw size={16} />
            Reset All Data
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
