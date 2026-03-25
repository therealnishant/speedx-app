import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Zap, MapPin } from 'lucide-react';
import { SpeedStats } from '@/src/types';

interface HistoryListProps {
  history: SpeedStats[];
  unit: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, unit }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/20">
        <Calendar size={48} strokeWidth={1} className="mb-4" />
        <p className="text-sm font-medium">No travel history yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {history.slice(0, 5).map((item, i) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          key={item.timestamp}
          className="glass rounded-2xl p-4 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
              <Calendar size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white/80">
                {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold">
                {new Date(item.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-neon-blue">
                <Zap size={10} />
                <span className="text-sm font-bold font-display">{Math.round(item.maxSpeed)}</span>
              </div>
              <span className="text-[8px] text-white/20 uppercase font-bold">Max {unit}</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-white/60">
                <MapPin size={10} />
                <span className="text-sm font-bold font-display">{item.distance.toFixed(1)}</span>
              </div>
              <span className="text-[8px] text-white/20 uppercase font-bold">Dist km</span>
            </div>
            <ChevronRight size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
