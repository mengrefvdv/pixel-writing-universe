import React, { useState } from 'react';
import { wallpapers, getRandomWallpaper } from '../../data/wallpapers';
import './WallpaperSelector.css';

interface WallpaperSelectorProps {
  currentWallpaperId: string;
  onSelect: (wallpaperId: string) => void;
}

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ 
  currentWallpaperId, 
  onSelect 
}) => {
  const [showAll, setShowAll] = useState(false);
  const randomWallpaper = getRandomWallpaper();

  return (
    <div className="wallpaper-selector">
      <div className="selector-header">
        <h3>🖼️ 选择壁纸</h3>
        <button 
          className="random-btn"
          onClick={() => onSelect(randomWallpaper.id)}
        >
          🎲 随机
        </button>
      </div>

      <div className="wallpaper-grid">
        {wallpapers.map((wallpaper) => (
          <div
            key={wallpaper.id}
            className={`wallpaper-item ${currentWallpaperId === wallpaper.id ? 'active' : ''}`}
            onClick={() => onSelect(wallpaper.id)}
          >
            <div 
              className="wallpaper-preview"
              style={{
                backgroundImage: `url(${wallpaper.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="wallpaper-info">
              <span className="wallpaper-name">{wallpaper.name}</span>
              <span className="wallpaper-category">{wallpaper.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallpaperSelector;
