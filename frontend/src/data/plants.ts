export interface Plant {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  growthStages: number[];
  color: string;
  glowColor?: string;
  specialEffect?: string;
}

export const plants: Plant[] = [
  {
    id: 'succulent',
    name: '多肉',
    emoji: '🌵',
    description: '耐旱的可爱多肉，不需要太多照顾',
    unlockLevel: 0,
    growthStages: [0, 1000, 5000, 15000, 30000],
    color: '#8B9A6E',
    glowColor: '#A8D8A0',
    specialEffect: 'drought_resistant'
  },
  {
    id: 'sakura',
    name: '樱花',
    emoji: '🌸',
    description: '美丽的樱花树，开花时花瓣飘落',
    unlockLevel: 5,
    growthStages: [0, 2000, 8000, 20000, 40000],
    color: '#FFB7C5',
    glowColor: '#FFD1DC',
    specialEffect: 'petal_fall'
  },
  {
    id: 'mushroom',
    name: '蘑菇',
    emoji: '🍄',
    description: '神秘的发光蘑菇，夜晚会发光',
    unlockLevel: 8,
    growthStages: [0, 1500, 6000, 12000, 25000],
    color: '#DEB887',
    glowColor: '#FFFF99',
    specialEffect: 'night_glow'
  },
  {
    id: 'magic',
    name: '魔法植物',
    emoji: '✨',
    description: '神秘的魔法植物，会产生随机增益',
    unlockLevel: 12,
    growthStages: [0, 3000, 10000, 25000, 50000],
    color: '#9966FF',
    glowColor: '#CC99FF',
    specialEffect: 'random_buff'
  },
  {
    id: 'glow',
    name: '发光植物',
    emoji: '💡',
    description: '照亮房间的发光植物',
    unlockLevel: 15,
    growthStages: [0, 4000, 15000, 35000, 60000],
    color: '#FFD700',
    glowColor: '#FFFF99',
    specialEffect: 'illuminate'
  },
  {
    id: 'vine',
    name: '藤蔓',
    emoji: '🪴',
    description: '攀爬墙壁的藤蔓植物',
    unlockLevel: 18,
    growthStages: [0, 5000, 20000, 45000, 80000],
    color: '#228B22',
    glowColor: '#32CD32',
    specialEffect: 'climb'
  },
  {
    id: 'bamboo',
    name: '竹子',
    emoji: '🎋',
    description: '优雅的竹林，带来宁静',
    unlockLevel: 20,
    growthStages: [0, 6000, 25000, 55000, 100000],
    color: '#6B8E23',
    glowColor: '#9ACD32',
    specialEffect: 'zen'
  }
];

export const getPlantByLevel = (level: number): Plant | undefined => {
  return plants.find(p => level >= p.unlockLevel);
};

export const getGrowthStage = (plant: Plant, totalWords: number): number => {
  const stages = plant.growthStages;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (totalWords >= stages[i]) {
      return i;
    }
  }
  return 0;
};

export const getStageName = (stage: number): string => {
  const names = ['种子', '发芽', '成长', '开花', '传说'];
  return names[stage] || '种子';
};
