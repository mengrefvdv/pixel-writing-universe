import React from 'react';
import { useGameStore, RoomTheme } from '../../stores/gameStore';
import './RoomTheme.css';

const themes: { id: RoomTheme; name: string; emoji: string; description: string }[] = [
  { id: 'day', name: '白天', emoji: '☀️', description: '明亮的阳光' },
  { id: 'dusk', name: '黄昏', emoji: '🌅', description: '橙红色天空' },
  { id: 'night', name: '深夜', emoji: '🌙', description: '星空月亮' },
  { id: 'rain', name: '下雨', emoji: '🌧️', description: '雨滴窗户' },
  { id: 'snow', name: '雪天', emoji: '❄️', description: '雪花飘落' },
  { id: 'tokyo', name: '东京夜景', emoji: '🌃', description: '霓虹灯效果' },
];

const RoomThemeComponent: React.FC = () => {
  const { roomTheme, unlockedThemes, setRoomTheme } = useGameStore();

  return (
    <div className="theme-container">
      <h3>🎨 房间主题</h3>
      <div className="theme-grid">
        {themes.map((theme) => {
          const isUnlocked = unlockedThemes.includes(theme.id);
          const isActive = roomTheme === theme.id;

          return (
            <button
              key={theme.id}
              className={`theme-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => isUnlocked && setRoomTheme(theme.id)}
              disabled={!isUnlocked}
            >
              <div className="theme-emoji">
                {isUnlocked ? theme.emoji : '🔒'}
              </div>
              <div className="theme-info">
                <span className="theme-name">{isUnlocked ? theme.name : '???'}</span>
                <span className="theme-desc">
                  {isUnlocked ? theme.description : '达成成就解锁'}
                </span>
              </div>
              {isActive && (
                <div className="active-indicator">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoomThemeComponent;
