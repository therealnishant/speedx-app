import React from 'react';
import { motion } from 'motion/react';
import { Navigation } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border border-neon-blue/30"
        />
        <motion.div 
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="absolute inset-0 rounded-full border border-neon-blue/20"
        />
        
        <div className="w-24 h-24 rounded-3xl bg-neon-blue flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.6)] relative z-10">
          <Navigation size={48} className="text-black rotate-45" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex flex-col items-center"
      >
        <h1 className="text-4xl font-bold font-display tracking-tighter">
          Speed<span className="text-neon-blue">X</span>
        </h1>
        <p className="text-white/20 text-xs uppercase tracking-[0.4em] mt-2 font-bold">
          Smart Speed Tracker
        </p>
      </motion.div>

      <div className="absolute bottom-12 w-32 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-full h-full bg-neon-blue shadow-[0_0_10px_rgba(0,242,255,0.8)]"
        />
      </div>
    </div>
  );
};
