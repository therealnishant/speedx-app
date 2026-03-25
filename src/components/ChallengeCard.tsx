import React from 'react';
import { Trophy, Timer } from 'lucide-react';
import { Challenge } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (id: string) => void;
  currentSpeed: number;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onStart, currentSpeed }) => {
  const isCompleted = challenge.endTime !== null;
  const isRunning = challenge.isActive;

  return (
    <button
      onClick={() => !isRunning && onStart(challenge.id)}
      disabled={isRunning}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl p-4 transition-all duration-300 border",
        isRunning 
          ? "bg-neon-purple/10 border-neon-purple neon-border-purple" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
            Challenge
          </span>
          <span className="text-xl font-bold font-display">
            {challenge.name}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          {isRunning ? (
            <div className="flex items-center gap-2 text-neon-purple">
              <Timer size={16} className="animate-pulse" />
              <span className="text-lg font-mono font-bold">
                {((Date.now() - (challenge.startTime || 0)) / 1000).toFixed(2)}s
              </span>
            </div>
          ) : challenge.bestTime ? (
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy size={16} />
              <span className="text-lg font-mono font-bold">
                {challenge.bestTime.toFixed(2)}s
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-white/20">
              Start
            </span>
          )}
        </div>
      </div>

      {isRunning && (
        <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-purple transition-all duration-100"
            style={{ width: `${(currentSpeed / challenge.targetSpeed) * 100}%` }}
          />
        </div>
      )}
    </button>
  );
};
