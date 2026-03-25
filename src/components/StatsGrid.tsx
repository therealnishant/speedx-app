import React from 'react';
import { TrendingUp, MapPin, Clock, Zap } from 'lucide-react';

interface StatsGridProps {
  distance: number;
  avgSpeed: number;
  duration: number;
  maxSpeed: number;
  unit: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ distance, avgSpeed, duration, maxSpeed, unit }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    { label: 'Distance', value: `${distance.toFixed(2)} km`, icon: MapPin, color: 'text-neon-blue' },
    { label: 'Avg Speed', value: `${avgSpeed.toFixed(1)} ${unit}`, icon: TrendingUp, color: 'text-neon-purple' },
    { label: 'Max Speed', value: `${maxSpeed.toFixed(1)} ${unit}`, icon: Zap, color: 'text-yellow-400' },
    { label: 'Duration', value: formatTime(duration), icon: Clock, color: 'text-white/60' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm px-6">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <stat.icon size={14} className={stat.color} />
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              {stat.label}
            </span>
          </div>
          <span className="text-lg font-bold font-display">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};
