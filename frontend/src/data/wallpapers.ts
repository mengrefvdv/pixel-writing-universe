export interface Wallpaper {
  id: string;
  name: string;
  category: 'nature' | 'city' | 'abstract' | 'space' | 'cozy';
  imageUrl: string;
  color: string;
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'forest-morning',
    name: '晨曦森林',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
    color: '#2d5016'
  },
  {
    id: 'mountain-sunset',
    name: '山巅落日',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    color: '#8b4513'
  },
  {
    id: 'ocean-wave',
    name: '海浪轻拍',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    color: '#1e3a5f'
  },
  {
    id: 'cherry-blossom',
    name: '樱花飘落',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1525069265163-f6e06839a060?w=1920&q=80',
    color: '#ffb7c5'
  },
  {
    id: 'city-night',
    name: '都市夜景',
    category: 'city',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    color: '#1a1a2e'
  },
  {
    id: 'tokyo-rain',
    name: '东京雨夜',
    category: 'city',
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
    color: '#2d3436'
  },
  {
    id: 'abstract-dream',
    name: '梦幻抽象',
    category: 'abstract',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    color: '#6c5ce7'
  },
  {
    id: 'galaxy-space',
    name: '银河星空',
    category: 'space',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    color: '#0f0c29'
  },
  {
    id: 'cozy-room',
    name: '温馨小屋',
    category: 'cozy',
    imageUrl: 'https://images.unsplash.com/photo-1502772492473-c32086568666?w=1920&q=80',
    color: '#8b7355'
  },
  {
    id: 'autumn-leaves',
    name: '秋叶纷飞',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    color: '#d35400'
  }
];

export const getRandomWallpaper = (): Wallpaper => {
  return wallpapers[Math.floor(Math.random() * wallpapers.length)];
};

export const getWallpaperById = (id: string): Wallpaper | undefined => {
  return wallpapers.find(w => w.id === id);
};

export const getWallpapersByCategory = (category: Wallpaper['category']): Wallpaper[] => {
  return wallpapers.filter(w => w.category === category);
};
