export type SpeedUnit = 'KM/H' | 'MPH';
export type TravelMode = 'bike' | 'car';

export interface SpeedStats {
  currentSpeed: number;
  maxSpeed: number;
  avgSpeed: number;
  distance: number;
  duration: number;
  timestamp: number;
}

export interface AppSettings {
  unit: SpeedUnit;
  speedLimit: number;
  soundEnabled: boolean;
  mode: TravelMode;
  theme: 'default' | 'cyan' | 'green';
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string | null;
  totalDistance: number;
  allTimeMaxSpeed: number;
}

export interface Challenge {
  id: string;
  name: string;
  targetSpeed: number;
  startTime: number | null;
  endTime: number | null;
  bestTime: number | null;
  isActive: boolean;
}
