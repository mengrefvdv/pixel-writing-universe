import { useState, useEffect, useRef } from 'react';

interface StudyRoomProps {
  onStartWriting?: () => void;
  onEnter?: () => void;
  user?: { username: string } | null;
}

const wallpapers = [
  { id: 1, name: '竹林', color: '#1a4d3e', bgImage: 'linear-gradient(135deg, #1a4d3e 0%, #2d5a4a 50%, #1a4d3e 100%)' },
  { id: 2, name: '星空', color: '#1a1a3e', bgImage: 'linear-gradient(135deg, #1a1a3e 0%, #2d1a4e 50%, #1a1a3e 100%)' },
  { id: 3, name: '暖阳', color: '#4a3e2d', bgImage: 'linear-gradient(135deg, #4a3e2d 0%, #6a5a3d 50%, #4a3e2d 100%)' },
  { id: 4, name: '海洋', color: '#1a3e4d', bgImage: 'linear-gradient(135deg, #1a3e4d 0%, #2d4a5e 50%, #1a3e4d 100%)' },
];

export default function StudyRoom({ onStartWriting, onEnter, user }: StudyRoomProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="study-room"
      style={{ background: selectedWallpaper.bgImage }}
    >
      {/* 星空粒子效果 */}
      <div className="stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 3D视差层 */}
      <div className="parallax-layer layer-back" style={{ transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)` }}>
        {/* 远处的书架 */}
        <div className="bookshelf-back">
          <div className="shelf-row">
            <div className="book" style={{ height: '80px', backgroundColor: '#8B4513' }} />
            <div className="book" style={{ height: '90px', backgroundColor: '#CD853F' }} />
            <div className="book" style={{ height: '75px', backgroundColor: '#A0522D' }} />
          </div>
        </div>
      </div>

      <div className="parallax-layer layer-mid" style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}>
        {/* 书桌 */}
        <div className="desk">
          <div className="desk-surface">
            <div className="computer">
              <div className="screen">
                <div className="screen-content">
                  <div className="cursor-blink">_</div>
                </div>
              </div>
              <div className="keyboard" />
            </div>
            <div className="lamp" />
            <div className="cup" />
          </div>
        </div>

        {/* 绿色植物 */}
        <div className="plant plant-1">
          <div className="pot" />
          <div className="leaves">
            <div className="leaf leaf-1" />
            <div className="leaf leaf-2" />
            <div className="leaf leaf-3" />
          </div>
        </div>

        <div className="plant plant-2">
          <div className="pot" />
          <div className="leaves">
            <div className="leaf leaf-1" />
            <div className="leaf leaf-2" />
          </div>
        </div>
      </div>

      <div className="parallax-layer layer-front" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>
        {/* 近处的书堆 */}
        <div className="book-stack">
          <div className="book-item" style={{ backgroundColor: '#DC143C' }}>📖</div>
          <div className="book-item" style={{ backgroundColor: '#4169E1' }}>📚</div>
          <div className="book-item" style={{ backgroundColor: '#32CD32' }}>📕</div>
        </div>
      </div>

      {/* 中心内容 */}
      <div className="center-content">
        <div className="welcome-card">
          <div className="avatar">✍️</div>
          <h1>欢迎回来{user ? `，${user.username}` : ''}</h1>
          <p>准备好开始今天的写作了吗？</p>
          <button onClick={onStartWriting || onEnter} className="enter-btn">
            🚪 进入书房
          </button>
        </div>
      </div>

      {/* 壁纸选择器 */}
      <button
        onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
        className="wallpaper-toggle"
      >
        🎨 壁纸
      </button>

      {showWallpaperMenu && (
        <div className="wallpaper-menu">
          {wallpapers.map((wallpaper) => (
            <button
              key={wallpaper.id}
              onClick={() => {
                setSelectedWallpaper(wallpaper);
                setShowWallpaperMenu(false);
              }}
              className="wallpaper-option"
              style={{ backgroundColor: wallpaper.color }}
            >
              {wallpaper.name}
            </button>
          ))}
        </div>
      )}

      {/* 鼠标提示 */}
      <div className="mouse-hint">
        <div className="mouse-icon" />
        <span>移动鼠标查看房间</span>
      </div>
    </div>
  );
}
