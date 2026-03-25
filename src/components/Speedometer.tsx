import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SpeedometerProps {
  speed: number;
  unit: 'KM/H' | 'MPH';
  mode: 'bike' | 'car';
  speedLimit: number;
  themeColor?: string;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ 
  speed, 
  unit, 
  mode, 
  speedLimit,
  themeColor = 'text-neon-blue'
}) => {
  const maxDisplaySpeed = mode === 'bike' ? 60 : 180;
  const [rotation, setRotation] = useState(-110);
  const isOverLimit = speed > speedLimit;

  useEffect(() => {
    const clampedSpeed = Math.min(speed, maxDisplaySpeed);
    const newRotation = (clampedSpeed / maxDisplaySpeed) * 220 - 110;
    setRotation(newRotation);
  }, [speed, maxDisplaySpeed]);

  const ticks = Array.from({ length: 13 }, (_, i) => (i * (maxDisplaySpeed / 12)));

  const glowClass = isOverLimit ? 'neon-glow-purple' : 
                    themeColor.includes('cyan') ? 'neon-glow-cyan' :
                    themeColor.includes('green') ? 'neon-glow-green' : 'neon-glow-blue';
  
  const strokeColor = isOverLimit ? '#bc13fe' : 
                     themeColor.includes('cyan') ? '#00ffff' :
                     themeColor.includes('green') ? '#39ff14' : '#00f2ff';

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-3xl transition-colors duration-500",
        isOverLimit ? "bg-neon-purple/10" : "bg-neon-blue/5"
      )} />
      
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/5" />
      
      {/* Progress Arc (SVG) */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray="289"
          strokeDashoffset={289 - (Math.min(speed, maxDisplaySpeed) / maxDisplaySpeed) * 215}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
          style={{ 
            filter: `drop-shadow(0 0 8px ${strokeColor})`,
            transform: 'rotate(125deg)',
            transformOrigin: 'center'
          }}
        />
      </svg>

      {/* Ticks and Numbers */}
      <div className="absolute inset-0">
        {ticks.map((tick) => {
          const tickRotation = (tick / maxDisplaySpeed) * 220 - 110;
          return (
            <div
              key={tick}
              className="absolute inset-0 flex flex-col items-center pt-4"
              style={{ transform: `rotate(${tickRotation}deg)` }}
            >
              <div className={cn(
                "w-0.5 h-3.5 rounded-full transition-colors duration-300",
                tick <= speed ? (isOverLimit ? "bg-neon-purple shadow-[0_0_8px_#bc13fe]" : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]") : "bg-white/10"
              )} />
              {Math.round(tick) % (mode === 'bike' ? 10 : 30) === 0 && (
                <span 
                  className="mt-2 text-[10px] font-bold text-white/20"
                  style={{ transform: `rotate(${-tickRotation}deg)` }}
                >
                  {Math.round(tick)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Center Display */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={isOverLimit ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.span 
            key={Math.round(speed)}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "text-8xl font-bold font-display tracking-tighter transition-colors duration-300",
              glowClass,
              isOverLimit ? "text-neon-purple" : themeColor.replace('text-', '')
            )}
          >
            {Math.round(speed)}
          </motion.span>
          <span className={cn(
            "text-xs font-bold tracking-[0.3em] uppercase mt-[-12px] transition-colors duration-300",
            isOverLimit ? "text-neon-purple/60" : "text-white/40"
          )}>
            {unit}
          </span>
        </motion.div>
      </div>

      {/* Needle */}
      <motion.div
        className="absolute bottom-1/2 left-1/2 w-1 h-32 origin-bottom -translate-x-1/2"
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 40, damping: 12 }}
      >
        <div className={cn(
          "w-full h-full rounded-full transition-all duration-300",
          isOverLimit 
            ? "bg-gradient-to-t from-neon-purple to-transparent shadow-[0_0_15px_#bc13fe]" 
            : "bg-gradient-to-t from-white to-transparent shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        )} />
      </motion.div>
      
      {/* Needle Hub */}
      <div className={cn(
        "absolute w-5 h-5 rounded-full bg-dark-bg border-2 z-20 transition-colors duration-300",
        isOverLimit ? "border-neon-purple shadow-[0_0_15px_#bc13fe]" : "border-white/20 shadow-xl"
      )} />
    </div>
  );
};
