import { useState, useCallback, useEffect } from 'react';
import { Plant } from '../data/plants';
import { Pet } from '../data/pets';
import { Achievement, calculateProgress, checkUnlocked } from '../data/achievements';

export type RoomTheme = 'day' | 'dusk' | 'night' | 'rain' | 'snow' | 'tokyo';

interface GameState {
  user: {
    id: string;
    username: string;
    email: string;
    level: number;
    xp: number;
    totalWords: number;
    currentStreak: number;
    lastWriteDate: string;
    articles: number;
    nightWrites: number;
  };
  plants: Plant[];
  activePlant: Plant | null;
  plantGrowth: Record<string, number>;
  pets: Pet[];
  activePet: Pet | null;
  petPosition: { x: number; y: number };
  currentAction: string | null;
  roomTheme: RoomTheme;
  unlockedThemes: RoomTheme[];
  achievements: Achievement[];
  isFocusMode: boolean;
  showNotification: boolean;
  notificationContent: string;
  editorTheme: string;
  wallpaperId: string;
  customWallpaper: string | null;
}

const initialState: GameState = {
  user: {
    id: '',
    username: '',
    email: '',
    level: 1,
    xp: 0,
    totalWords: 0,
    currentStreak: 0,
    lastWriteDate: '',
    articles: 0,
    nightWrites: 0,
  },
  plants: [],
  activePlant: null,
  plantGrowth: {},
  pets: [],
  activePet: null,
  petPosition: { x: 50, y: 50 },
  currentAction: null,
  roomTheme: 'day',
  unlockedThemes: ['day'],
  achievements: [],
  isFocusMode: false,
  showNotification: false,
  notificationContent: '',
  editorTheme: 'classic-dark',
  wallpaperId: 'forest-morning',
  customWallpaper: null,
};

export function useGameStore() {
  const [state, setState] = useState<GameState>(initialState);

  // 加载保存的数据
  useEffect(() => {
    const saved = localStorage.getItem('pixel-writer-game');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...initialState, ...parsed });
      } catch (e) {
        console.error('Failed to load game state:', e);
      }
    }
  }, []);

  // 保存数据
  useEffect(() => {
    localStorage.setItem('pixel-writer-game', JSON.stringify(state));
  }, [state]);

  const addWords = useCallback((words: number) => {
    setState((prev) => {
      const newTotalWords = prev.user.totalWords + words;
      const xpGain = Math.floor(words / 100) * 5;
      const newXp = prev.user.xp + xpGain;
      const level = Math.floor(newXp / 100) + 1;
      
      if (words >= 500) {
        setTimeout(() => {
          setState((s) => ({ ...s, showNotification: true, notificationContent: `🎉 太棒了！获得 ${xpGain} XP！` }));
          setTimeout(() => setState((s) => ({ ...s, showNotification: false })), 3000);
        }, 100);
      }
      
      return {
        ...prev,
        user: {
          ...prev.user,
          totalWords: newTotalWords,
          xp: newXp,
          level,
        },
      };
    });
  }, []);

  const updateStreak = useCallback(() => {
    setState((prev) => {
      const now = new Date();
      const today = now.toDateString();
      const lastDate = prev.user.lastWriteDate;
      let newStreak = prev.user.currentStreak;
      let newNightWrites = prev.user.nightWrites;
      
      if (lastDate !== today) {
        const lastDateObj = new Date(lastDate);
        const diffDays = Math.floor((now.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak = prev.user.currentStreak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        
        if (now.getHours() >= 2 && now.getHours() < 4) {
          newNightWrites++;
        }
      }
      
      return {
        ...prev,
        user: {
          ...prev.user,
          currentStreak: newStreak,
          lastWriteDate: today,
          nightWrites: newNightWrites,
        },
      };
    });
  }, []);

  const unlockPlant = useCallback((plantId: string) => {
    setState((prev) => {
      if (!prev.plants.find((p: Plant) => p.id === plantId)) {
        return {
          ...prev,
          plants: [...prev.plants, { id: plantId } as Plant],
        };
      }
      return prev;
    });
  }, []);

  const unlockPet = useCallback((petId: string) => {
    setState((prev) => {
      if (!prev.pets.find((p: Pet) => p.id === petId)) {
        return {
          ...prev,
          pets: [...prev.pets, { id: petId } as Pet],
        };
      }
      return prev;
    });
  }, []);

  const unlockTheme = useCallback((theme: RoomTheme) => {
    setState((prev) => {
      if (!prev.unlockedThemes.includes(theme)) {
        return {
          ...prev,
          unlockedThemes: [...prev.unlockedThemes, theme],
        };
      }
      return prev;
    });
  }, []);

  const setActivePlant = useCallback((plant: Plant | null) => {
    setState((prev) => ({ ...prev, activePlant: plant }));
  }, []);

  const setActivePet = useCallback((pet: Pet | null) => {
    setState((prev) => ({ ...prev, activePet: pet }));
  }, []);

  const setRoomTheme = useCallback((theme: RoomTheme) => {
    setState((prev) => ({ ...prev, roomTheme: theme }));
  }, []);

  const setPetPosition = useCallback((x: number, y: number) => {
    setState((prev) => ({ ...prev, petPosition: { x, y } }));
  }, []);

  const setCurrentAction = useCallback((action: string | null) => {
    setState((prev) => ({ ...prev, currentAction: action }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setState((prev) => ({ ...prev, isFocusMode: !prev.isFocusMode }));
  }, []);

  const showNotificationMessage = useCallback((content: string) => {
    setState((prev) => ({ ...prev, showNotification: true, notificationContent: content }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, showNotification: false }));
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setState((prev) => ({ ...prev, showNotification: false }));
  }, []);

  const setAchievements = useCallback((achievementList: Achievement[]) => {
    setState((prev) => ({ ...prev, achievements: achievementList }));
  }, []);

  const updateAchievements = useCallback(() => {
    setState((prev) => {
      const stats = {
        totalWords: prev.user.totalWords,
        streak: prev.user.currentStreak,
        articles: prev.user.articles,
        nightWrites: prev.user.nightWrites,
      };

      return {
        ...prev,
        achievements: prev.achievements.map((achievement: Achievement) => {
          const newProgress = calculateProgress(achievement, stats);
          const wasUnlocked = achievement.unlocked;
          const isNowUnlocked = checkUnlocked(achievement, stats);
          
          if (!wasUnlocked && isNowUnlocked) {
            setTimeout(() => {
              showNotificationMessage(`🏆 解锁成就: ${achievement.name} ${achievement.emoji}`);
            }, 100);
          }
          
          return {
            ...achievement,
            progress: newProgress,
            unlocked: isNowUnlocked,
          };
        }),
      };
    });
  }, [showNotificationMessage]);

  const calculateLevel = useCallback(() => {
    setState((prev) => {
      const level = Math.floor(prev.user.xp / 100) + 1;
      
      if (level > prev.user.level) {
        showNotificationMessage(`🎊 升级！您现在是 ${level} 级！`);
      }
      
      return prev;
    });
  }, [showNotificationMessage]);

  const setEditorTheme = useCallback((themeId: string) => {
    setState((prev) => ({ ...prev, editorTheme: themeId }));
  }, []);

  const setWallpaper = useCallback((wallpaperId: string) => {
    setState((prev) => ({ ...prev, wallpaperId }));
  }, []);

  const setCustomWallpaper = useCallback((url: string | null) => {
    setState((prev) => ({ ...prev, customWallpaper: url }));
  }, []);

  return {
    ...state,
    addWords,
    updateStreak,
    unlockPlant,
    unlockPet,
    unlockTheme,
    setActivePlant,
    setActivePet,
    setRoomTheme,
    setPetPosition,
    setCurrentAction,
    toggleFocusMode,
    showNotificationMessage,
    hideNotification,
    setAchievements,
    updateAchievements,
    calculateLevel,
    setEditorTheme,
    setWallpaper,
    setCustomWallpaper,
  };
}
