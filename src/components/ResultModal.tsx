import React from 'react';
import { X, Share2, Award, Zap, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { SpeedStats } from '@/src/types';

interface ResultModalProps {
  stats: SpeedStats;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ stats, onClose }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SpeedX Performance',
          text: `I just hit ${stats.maxSpeed.toFixed(1)} km/h with SpeedX! My average was ${stats.avgSpeed.toFixed(1)} km/h over ${stats.distance.toFixed(2)} km.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neon-purple/20 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60"
        >
          <X size={20} />
        </button>

        <div className="relative flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-purple/20 flex items-center justify-center mb-4 border border-neon-purple/30">
            <Award size={32} className="text-neon-purple" />
          </div>
          
          <h2 className="text-2xl font-bold font-display mb-1">Session Complete</h2>
          <p className="text-white/40 text-sm mb-8">Great performance today!</p>

          <div className="grid grid-cols-2 gap-6 w-full mb-8">
            <div className="flex flex-col items-center">
              <Zap size={20} className="text-yellow-400 mb-2" />
              <span className="text-2xl font-bold font-display">{stats.maxSpeed.toFixed(1)}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Max km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <MapPin size={20} className="text-neon-blue mb-2" />
              <span className="text-2xl font-bold font-display">{stats.distance.toFixed(2)}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total km</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock size={20} className="text-white/60 mb-2" />
              <span className="text-2xl font-bold font-display">{Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Duration</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 size={20} className="text-neon-purple mb-2" />
              <span className="text-2xl font-bold font-display">{stats.avgSpeed.toFixed(1)}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Avg km/h</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={handleShare}
              className="w-full py-4 rounded-2xl bg-neon-purple text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(188,19,254,0.4)] active:scale-95 transition-transform"
            >
              <Share2 size={18} />
              Share Results
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 text-white/60 font-bold hover:bg-white/10 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
