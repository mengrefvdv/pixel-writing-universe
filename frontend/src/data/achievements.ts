export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: AchievementCondition;
  reward: AchievementReward;
  unlocked: boolean;
  progress: number;
}

export interface AchievementCondition {
  type: 'words' | 'days' | 'streak' | 'articles';
  target: number;
}

export interface AchievementReward {
  type: 'plant' | 'pet' | 'theme' | 'xp';
  value: string | number;
}

export const achievements: Achievement[] = [
  {
    id: 'first_blood',
    name: '初露锋芒',
    emoji: '🌱',
    description: '累计写作1000字',
    condition: { type: 'words', target: 1000 },
    reward: { type: 'plant', value: 'succulent' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'growing_strong',
    name: '茁壮成长',
    emoji: '🌿',
    description: '累计写作5000字',
    condition: { type: 'words', target: 5000 },
    reward: { type: 'pet', value: 'shiba' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'blooming',
    name: '花开富贵',
    emoji: '🌸',
    description: '累计写作10000字',
    condition: { type: 'words', target: 10000 },
    reward: { type: 'plant', value: 'sakura' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'book_worm',
    name: '著作等身',
    emoji: '📚',
    description: '累计写作50000字',
    condition: { type: 'words', target: 50000 },
    reward: { type: 'theme', value: 'study' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'seven_days',
    name: '连续七日',
    emoji: '🔥',
    description: '连续写作7天',
    condition: { type: 'streak', target: 7 },
    reward: { type: 'xp', value: 100 },
    unlocked: false,
    progress: 0
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    emoji: '🌙',
    description: '凌晨2点后写作',
    condition: { type: 'days', target: 1 },
    reward: { type: 'theme', value: 'night' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'article_master',
    name: '文章达人',
    emoji: '✍️',
    description: '完成10篇文章',
    condition: { type: 'articles', target: 10 },
    reward: { type: 'pet', value: 'fox' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'legendary',
    name: '传奇作家',
    emoji: '👑',
    description: '累计写作100000字',
    condition: { type: 'words', target: 100000 },
    reward: { type: 'plant', value: 'bamboo' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'month_streak',
    name: '月度坚持',
    emoji: '💪',
    description: '连续写作30天',
    condition: { type: 'streak', target: 30 },
    reward: { type: 'pet', value: 'ghost' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'midnight_writer',
    name: '午夜作家',
    emoji: '🌃',
    description: '累计在凌晨写作10次',
    condition: { type: 'days', target: 10 },
    reward: { type: 'theme', value: 'tokyo' },
    unlocked: false,
    progress: 0
  }
];

export const calculateProgress = (
  achievement: Achievement,
  stats: { totalWords: number; streak: number; articles: number; nightWrites: number }
): number => {
  switch (achievement.condition.type) {
    case 'words':
      return Math.min(100, (stats.totalWords / achievement.condition.target) * 100);
    case 'streak':
      return Math.min(100, (stats.streak / achievement.condition.target) * 100);
    case 'articles':
      return Math.min(100, (stats.articles / achievement.condition.target) * 100);
    case 'days':
      return Math.min(100, (stats.nightWrites / achievement.condition.target) * 100);
    default:
      return 0;
  }
};

export const checkUnlocked = (
  achievement: Achievement,
  stats: { totalWords: number; streak: number; articles: number; nightWrites: number }
): boolean => {
  switch (achievement.condition.type) {
    case 'words':
      return stats.totalWords >= achievement.condition.target;
    case 'streak':
      return stats.streak >= achievement.condition.target;
    case 'articles':
      return stats.articles >= achievement.condition.target;
    case 'days':
      return stats.nightWrites >= achievement.condition.target;
    default:
      return false;
  }
};
