import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  History as HistoryIcon, 
  Play, 
  Square, 
  Crown, 
  Navigation, 
  AlertTriangle,
  ChevronRight,
  Flame,
  Award,
  Zap,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import { Speedometer } from './components/Speedometer';
import { StatsGrid } from './components/StatsGrid';
import { ChallengeCard } from './components/ChallengeCard';
import { ResultModal } from './components/ResultModal';
import { AdPlaceholder } from './components/AdPlaceholder';
import { SettingsModal } from './components/SettingsModal';
import { HistoryList } from './components/HistoryList';
import { SplashScreen } from './components/SplashScreen';
import { SpeedStats, Challenge, AppSettings, UserProgress } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [stats, setStats] = useState<SpeedStats>({
    currentSpeed: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    distance: 0,
    duration: 0,
    timestamp: Date.now(),
  });
  
  const [settings, setSettings] = useState<AppSettings>({
    unit: 'KM/H',
    speedLimit: 80,
    soundEnabled: true,
    mode: 'car',
    theme: 'default',
  });

  const [progress, setProgress] = useState<UserProgress>({
    streak: 0,
    lastActiveDate: null,
    totalDistance: 0,
    allTimeMaxSpeed: 0,
  });

  const [history, setHistory] = useState<SpeedStats[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '0-40', name: '0-40 Sprint', targetSpeed: 40, startTime: null, endTime: null, bestTime: null, isActive: false },
    { id: '0-60', name: '0-60 Sprint', targetSpeed: 60, startTime: null, endTime: null, bestTime: null, isActive: false },
  ]);

  const [showResult, setShowResult] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const watchId = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPosition = useRef<GeolocationPosition | null>(null);
  const sessionStartTime = useRef<number | null>(null);
  const lastAlertTime = useRef<number>(0);

  // Initial Load
  useEffect(() => {
    const savedSettings = localStorage.getItem('speedx_settings');
    const savedProgress = localStorage.getItem('speedx_progress');
    const savedHistory = localStorage.getItem('speedx_history');
    const savedChallenges = localStorage.getItem('speedx_challenges');
    const savedPremium = localStorage.getItem('speedx_premium');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedProgress) {
      const p = JSON.parse(savedProgress);
      setProgress(p);
      checkStreak(p);
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
    if (savedPremium) setIsPremium(true);

    // Simulate splash screen
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  const checkStreak = (p: UserProgress) => {
    const today = new Date().toDateString();
    if (p.lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (p.lastActiveDate === yesterday.toDateString()) {
      const newProgress = { ...p, streak: p.streak + 1, lastActiveDate: today };
      setProgress(newProgress);
      localStorage.setItem('speedx_progress', JSON.stringify(newProgress));
    } else if (p.lastActiveDate === null) {
      const newProgress = { ...p, streak: 1, lastActiveDate: today };
      setProgress(newProgress);
      localStorage.setItem('speedx_progress', JSON.stringify(newProgress));
    } else {
      const newProgress = { ...p, streak: 1, lastActiveDate: today };
      setProgress(newProgress);
      localStorage.setItem('speedx_progress', JSON.stringify(newProgress));
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const speak = (text: string) => {
    if (!settings.soundEnabled || !window.speechSynthesis) return;
    const now = Date.now();
    if (now - lastAlertTime.current < 5000) return; // Throttle alerts
    
    lastAlertTime.current = now;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const currentSpeedMs = position.coords.speed || 0;
    let currentSpeed = currentSpeedMs * 3.6; // Default KM/H
    
    if (settings.unit === 'MPH') {
      currentSpeed = currentSpeed * 0.621371;
    }
    
    setSpeed(currentSpeed);

    // Speed Limit Alert
    if (currentSpeed > settings.speedLimit) {
      speak(`Warning! Speed limit exceeded.`);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    
    setStats(prev => {
      const newMax = Math.max(prev.maxSpeed, currentSpeed);
      
      let newDistance = prev.distance;
      if (lastPosition.current) {
        const d = calculateDistance(
          lastPosition.current.coords.latitude,
          lastPosition.current.coords.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
        if (currentSpeed > 1) {
          newDistance += d;
        }
      }
      lastPosition.current = position;

      const totalDuration = sessionStartTime.current ? (Date.now() - sessionStartTime.current) / 1000 : 0;
      const newAvg = totalDuration > 0 ? (newDistance / (totalDuration / 3600)) : 0;

      return {
        ...prev,
        currentSpeed,
        maxSpeed: newMax,
        distance: newDistance,
        avgSpeed: isNaN(newAvg) ? 0 : newAvg,
        duration: Math.floor(totalDuration)
      };
    });

    // Challenge Logic
    setChallenges(prev => prev.map(ch => {
      if (!ch.isActive) return ch;
      if (ch.startTime === null && currentSpeed > 0.5) return { ...ch, startTime: Date.now() };
      if (ch.startTime !== null && currentSpeed >= ch.targetSpeed) {
        const timeTaken = (Date.now() - ch.startTime) / 1000;
        const newBest = ch.bestTime === null || timeTaken < ch.bestTime ? timeTaken : ch.bestTime;
        const updatedCh = { ...ch, isActive: false, endTime: Date.now(), bestTime: newBest };
        
        setTimeout(() => {
          const all = prev.map(c => c.id === ch.id ? updatedCh : c);
          localStorage.setItem('speedx_challenges', JSON.stringify(all));
        }, 0);
        return updatedCh;
      }
      return ch;
    }));
  }, [settings]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setIsTracking(true);
    sessionStartTime.current = Date.now();
    lastPosition.current = null;
    setStats({
      currentSpeed: 0,
      maxSpeed: 0,
      avgSpeed: 0,
      distance: 0,
      duration: 0,
      timestamp: Date.now(),
    });

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (err) => {
        setError("Please enable GPS for tracking");
        setIsTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    timerRef.current = setInterval(() => {
      setStats(prev => ({
        ...prev,
        duration: sessionStartTime.current ? Math.floor((Date.now() - sessionStartTime.current) / 1000) : 0
      }));
    }, 1000);
  };

  const stopTracking = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsTracking(false);
    setSpeed(0);

    // Save to History
    const newHistory = [stats, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('speedx_history', JSON.stringify(newHistory));

    // Update Progress
    const newProgress = {
      ...progress,
      totalDistance: progress.totalDistance + stats.distance,
      allTimeMaxSpeed: Math.max(progress.allTimeMaxSpeed, stats.maxSpeed),
    };
    setProgress(newProgress);
    localStorage.setItem('speedx_progress', JSON.stringify(newProgress));
    
    if (!isPremium) setShowInterstitial(true);
    else setShowResult(true);
  };

  const startChallenge = (id: string) => {
    if (!isTracking) {
      startTracking();
    }
    setChallenges(prev => prev.map(ch => 
      ch.id === id ? { ...ch, isActive: true, startTime: null, endTime: null } : { ...ch, isActive: false }
    ));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('speedx_settings', JSON.stringify(updated));
  };

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const themeColor = settings.theme === 'cyan' ? 'text-neon-cyan' : settings.theme === 'green' ? 'text-neon-green' : 'text-neon-blue';

  if (isLoading) return <SplashScreen />;

  return (
    <div className="min-h-screen flex flex-col items-center pb-24 pt-6 px-4 relative overflow-y-auto">
      {/* Top Banner Ad */}
      {!isPremium && (
        <div className="w-full mb-4">
          <AdPlaceholder type="banner" />
        </div>
      )}

      {/* Header */}
      <header className="w-full flex justify-between items-center px-2 mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500",
            settings.theme === 'cyan' ? 'bg-neon-cyan' : settings.theme === 'green' ? 'bg-neon-green' : 'bg-neon-blue'
          )}>
            <Navigation size={22} className="text-black rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-display tracking-tight leading-none">
              Speed<span className={themeColor.replace('text-', 'text-')}>X</span>
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <Flame size={10} className="text-orange-500" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{progress.streak} Day Streak</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2.5 rounded-xl glass text-white/60 hover:text-white transition-all"
          >
            <HistoryIcon size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-xl glass text-white/60 hover:text-white transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full gap-8">
        {/* Speedometer */}
        <div className="relative py-4">
          <Speedometer 
            speed={speed} 
            unit={settings.unit} 
            mode={settings.mode} 
            speedLimit={settings.speedLimit}
            themeColor={themeColor}
          />
          
          {/* Record Badge */}
          <div className="absolute -top-2 -right-2 glass rounded-2xl px-4 py-2 flex flex-col items-center shadow-2xl">
            <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Best</span>
            <span className="text-sm font-bold text-yellow-400 font-display">{progress.allTimeMaxSpeed.toFixed(1)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid 
          distance={stats.distance}
          avgSpeed={stats.avgSpeed}
          duration={stats.duration}
          maxSpeed={stats.maxSpeed}
        />

        {/* Challenges & History Toggle */}
        <div className="w-full max-w-sm px-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Active Challenges</h3>
              <Award size={14} className="text-white/20" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {challenges.map(ch => (
                <ChallengeCard 
                  key={ch.id} 
                  challenge={ch} 
                  onStart={startChallenge} 
                  currentSpeed={speed}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Recent Trips</h3>
              <button onClick={() => setShowHistory(true)} className="text-[10px] font-bold text-neon-blue uppercase tracking-widest">View All</button>
            </div>
            <HistoryList history={history} unit={settings.unit} />
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-40">
        <div className="w-full max-w-sm glass rounded-[2.5rem] p-3 flex items-center gap-3 shadow-2xl">
          {!isTracking ? (
            <button 
              onClick={startTracking}
              className={cn(
                "flex-1 h-16 rounded-[1.8rem] text-black font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl",
                settings.theme === 'cyan' ? 'bg-neon-cyan shadow-neon-cyan/20' : settings.theme === 'green' ? 'bg-neon-green shadow-neon-green/20' : 'bg-neon-blue shadow-neon-blue/20'
              )}
            >
              <Play size={22} fill="currentColor" />
              START SESSION
            </button>
          ) : (
            <button 
              onClick={stopTracking}
              className="flex-1 h-16 rounded-[1.8rem] bg-red-500 text-white font-bold flex items-center justify-center gap-3 shadow-red-500/20 shadow-xl active:scale-95 transition-all"
            >
              <Square size={22} fill="currentColor" />
              STOP SESSION
            </button>
          )}
          <button 
            onClick={() => setIsPremium(!isPremium)}
            className={cn(
              "w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all",
              isPremium ? "bg-yellow-400 text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <Crown size={22} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            settings={settings} 
            onUpdate={updateSettings} 
            onReset={resetData} 
            onClose={() => setShowSettings(false)} 
          />
        )}

        {showHistory && (
          <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-display">Travel History</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 rounded-full glass text-white/60">
                <X size={20} />
              </button>
            </div>
            <HistoryList history={history} unit={settings.unit} />
          </div>
        )}

        {showInterstitial && (
          <AdPlaceholder 
            type="interstitial" 
            onClose={() => {
              setShowInterstitial(false);
              setShowResult(true);
            }} 
          />
        )}

        {showResult && (
          <ResultModal 
            stats={stats} 
            onClose={() => setShowResult(false)} 
          />
        )}

        {error && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed top-20 left-4 right-4 z-[90] bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="text-red-500" size={20} />
            <p className="text-xs font-medium text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-white/40">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
