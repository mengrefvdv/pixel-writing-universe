export interface Pet {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  personality: string;
  actions: PetAction[];
  color: string;
}

export interface PetAction {
  id: string;
  name: string;
  emoji: string;
  minWords: number;
  animation: string;
}

export const pets: Pet[] = [
  {
    id: 'black_cat',
    name: '黑猫',
    emoji: '🐱',
    description: '高冷优雅的黑猫',
    unlockLevel: 0,
    personality: '高冷',
    color: '#1a1a1a',
    actions: [
      { id: 'sleep', name: '睡觉', emoji: '😴', minWords: 0, animation: 'sleep' },
      { id: 'groom', name: '舔毛', emoji: '😺', minWords: 500, animation: 'groom' },
      { id: 'jump', name: '跳跃', emoji: '🐾', minWords: 1000, animation: 'jump' },
      { id: 'stretch', name: '伸懒腰', emoji: '�懒腰', minWords: 2000, animation: 'stretch' },
      { id: 'purr', name: '咕噜', emoji: '😻', minWords: 5000, animation: 'purr' }
    ]
  },
  {
    id: 'shiba',
    name: '柴犬',
    emoji: '🐕',
    description: '热情活泼的柴犬',
    unlockLevel: 3,
    personality: '热情',
    color: '#D2691E',
    actions: [
      { id: 'wag', name: '摇尾巴', emoji: '🐶', minWords: 0, animation: 'wag' },
      { id: 'spin', name: '转圈', emoji: '🌀', minWords: 500, animation: 'spin' },
      { id: 'fetch', name: '扑球', emoji: '🎾', minWords: 1500, animation: 'fetch' },
      { id: 'happy', name: '开心', emoji: '🐕‍🦺', minWords: 3000, animation: 'happy' },
      { id: 'dance', name: '跳舞', emoji: '💃', minWords: 6000, animation: 'dance' }
    ]
  },
  {
    id: 'penguin',
    name: '企鹅',
    emoji: '🐧',
    description: '呆萌可爱的企鹅',
    unlockLevel: 6,
    personality: '呆萌',
    color: '#4a4a4a',
    actions: [
      { id: 'waddle', name: '摇摆', emoji: '🐧', minWords: 0, animation: 'waddle' },
      { id: 'slide', name: '滑行', emoji: '🛷', minWords: 800, animation: 'slide' },
      { id: 'fish', name: '吃鱼', emoji: '🐟', minWords: 2000, animation: 'fish' },
      { id: 'huddle', name: '抱团', emoji: '👨‍👩‍👧', minWords: 4000, animation: 'huddle' },
      { id: 'snowball', name: '滚雪球', emoji: '⛄', minWords: 8000, animation: 'snowball' }
    ]
  },
  {
    id: 'fox',
    name: '白狐',
    emoji: '🦊',
    description: '神秘优雅的白狐',
    unlockLevel: 10,
    personality: '神秘',
    color: '#F5F5F5',
    actions: [
      { id: 'glow', name: '发光', emoji: '✨', minWords: 0, animation: 'glow' },
      { id: 'teleport', name: '瞬移', emoji: '👻', minWords: 1000, animation: 'teleport' },
      { id: 'howl', name: '望月', emoji: '🌙', minWords: 3000, animation: 'howl' },
      { id: 'sparkle', name: '闪烁', emoji: '💎', minWords: 6000, animation: 'sparkle' },
      { id: 'aurora', name: '极光', emoji: '🌌', minWords: 12000, animation: 'aurora' }
    ]
  },
  {
    id: 'jellyfish',
    name: '水母',
    emoji: '🪼',
    description: '梦幻飘逸的水母',
    unlockLevel: 14,
    personality: '梦幻',
    color: '#87CEEB',
    actions: [
      { id: 'float', name: '漂浮', emoji: '🪼', minWords: 0, animation: 'float' },
      { id: 'glow', name: '发光', emoji: '💡', minWords: 1500, animation: 'glow' },
      { id: 'morph', name: '变形', emoji: '🔮', minWords: 4000, animation: 'morph' },
      { id: 'bubble', name: '吐泡泡', emoji: '💧', minWords: 8000, animation: 'bubble' },
      { id: 'rainbow', name: '彩虹', emoji: '🌈', minWords: 15000, animation: 'rainbow' }
    ]
  },
  {
    id: 'ghost',
    name: '小幽灵',
    emoji: '👻',
    description: '调皮可爱的小幽灵',
    unlockLevel: 18,
    personality: '调皮',
    color: '#E0E0E0',
    actions: [
      { id: 'float', name: '漂浮', emoji: '👻', minWords: 0, animation: 'float' },
      { id: 'blink', name: '闪烁', emoji: '✨', minWords: 800, animation: 'blink' },
      { id: 'through', name: '穿墙', emoji: '🌀', minWords: 2500, animation: 'through' },
      { id: 'prank', name: '恶作剧', emoji: '😈', minWords: 5000, animation: 'prank' },
      { id: 'possess', name: '附身', emoji: '👁️', minWords: 10000, animation: 'possess' }
    ]
  }
];

export const getPetByLevel = (level: number): Pet | undefined => {
  return pets.find(p => level >= p.unlockLevel);
};

export const getAvailableActions = (pet: Pet, totalWords: number): PetAction[] => {
  return pet.actions.filter(a => totalWords >= a.minWords);
};

export const getRandomAction = (pet: Pet, totalWords: number): PetAction | undefined => {
  const available = getAvailableActions(pet, totalWords);
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
};
