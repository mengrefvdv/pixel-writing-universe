import React from 'react';
import './Navigation.css';

type View = 'study' | 'editor' | 'articles' | 'files' | 'reader' | 'bookshelf' | 'timer' | 'tools' | 'discover' | 'settings' | 'achievements' | 'plant-selector' | 'pet-selector' | 'theme-selector';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  user: any;
  level?: number;
  xp?: number;
  streak?: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onLogout, user, level = 1, xp = 0, streak = 0 }) => {
  const navItems = [
    { id: 'study', label: '赛博书房', icon: '🏠', category: 'main' },
    { id: 'editor', label: '开始码字', icon: '✍️', category: 'main' },
    { id: 'bookshelf', label: '我的书架', icon: '📚', category: 'main' },
    { id: 'articles', label: '文章列表', icon: '📝', category: 'main' },
    { id: 'achievements', label: '成就系统', icon: '🏆', category: 'game' },
    { id: 'plant-selector', label: '我的植物', icon: '🌿', category: 'game' },
    { id: 'pet-selector', label: '我的宠物', icon: '🐾', category: 'game' },
    { id: 'theme-selector', label: '房间主题', icon: '🎨', category: 'game' },
    { id: 'timer', label: '码字计时', icon: '⏱️', category: 'tools' },
    { id: 'tools', label: '工具箱', icon: '🔧', category: 'tools' },
    { id: 'files', label: '文件管理', icon: '📁', category: 'tools' },
    { id: 'discover', label: '发现', icon: '🔍', category: 'other' },
    { id: 'settings', label: '设置', icon: '⚙️', category: 'other' },
  ];

  const groupedItems = {
    main: navItems.filter(item => item.category === 'main'),
    game: navItems.filter(item => item.category === 'game'),
    tools: navItems.filter(item => item.category === 'tools'),
    other: navItems.filter(item => item.category === 'other'),
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="user-stats">
          <div className="level-badge">
            <span className="level-icon">⭐</span>
            <span className="level-text">Lv.{level}</span>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${Math.min(100, (xp / 100) * 100)}%` }}></div>
            </div>
            <span className="xp-text">{xp} XP</span>
          </div>
          {streak > 0 && (
            <div className="streak-badge">
              <span>🔥 {streak}天</span>
            </div>
          )}
        </div>
        <h2>✍️ 像素码字</h2>
        <p className="user-info">欢迎, {user?.username}</p>
      </div>
      
      <div className="nav-menu">
        <div className="nav-section">
          <h3 className="section-title">📌 主页</h3>
          {groupedItems.main.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id as View)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h3 className="section-title">🎮 游戏化</h3>
          {groupedItems.game.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id as View)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h3 className="section-title">🛠️ 工具</h3>
          {groupedItems.tools.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id as View)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h3 className="section-title">✨ 其他</h3>
          {groupedItems.other.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id as View)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="nav-footer">
        <button className="logout-btn" onClick={onLogout}>
          🚪 退出登录
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
