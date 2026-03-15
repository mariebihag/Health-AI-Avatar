import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ── Types ───────────────────────────────────────────────────────── */
export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  goal: 'lose' | 'maintain' | 'gain';
  bmi: number | null;
  bmr: number | null;
  recommendedCalories: number | null;
  bmiEntered: boolean;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  computeBMI: () => void;
  notifications: string[];
  addNotification: (msg: string) => void;
  clearNotification: (idx: number) => void;
}

/* ── Helper exported function ────────────────────────────────────── */
export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#38bdf8' };
  if (bmi < 25)   return { label: 'Normal',      color: '#22c55e' };
  if (bmi < 30)   return { label: 'Overweight',  color: '#f59e0b' };
  return             { label: 'Obese',           color: '#ef4444' };
}

/* ── Default state ───────────────────────────────────────────────── */
const defaultProfile: UserProfile = {
  name: 'User',
  email: 'user@healthai.com',
  avatar: null,
  height: 0,
  weight: 0,
  age: 0,
  gender: 'male',
  goal: 'maintain',
  bmi: null,
  bmr: null,
  recommendedCalories: null,
  bmiEntered: false,
};

/* ── Context ─────────────────────────────────────────────────────── */
const UserProfileContext = createContext<UserProfileContextType | null>(null);

/* ── Provider ────────────────────────────────────────────────────── */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('healthai_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [notifications, setNotifications] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('healthai_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('healthai_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('healthai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 20));
  };

  const clearNotification = (idx: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== idx));
  };

  const computeBMI = () => {
    const { height, weight, age, gender, goal } = profile;
    if (!height || !weight || !age) return;

    const heightM = height / 100;
    const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

    const bmr = gender === 'male'
      ? Math.round(10 * weight + 6.25 * height - 5 * age + 5)
      : Math.round(10 * weight + 6.25 * height - 5 * age - 161);

    const tdee = Math.round(bmr * 1.375);
    const calMap = { lose: tdee - 500, maintain: tdee, gain: tdee + 500 };
    const recommendedCalories = calMap[goal];

    setProfile(prev => ({ ...prev, bmi, bmr, recommendedCalories, bmiEntered: true }));

    const goalLabel = goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : 'Maintenance';
    addNotification(
      `BMI recorded: ${bmi} — Recommended daily intake: ${recommendedCalories} kcal (${goalLabel})`
    );
  };

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      computeBMI,
      notifications,
      addNotification,
      clearNotification,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────────────── */
export function useUserProfile(): UserProfileContextType {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used inside UserProfileProvider');
  return ctx;
}