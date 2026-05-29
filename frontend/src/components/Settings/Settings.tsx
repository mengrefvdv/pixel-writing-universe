import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './Settings.css';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.theme || 'light');
  const [wallpaper, setWallpaper] = useState(user?.wallpaper || 'bamboo');
  const [saving, setSaving] = useState(false);

  const themes = [
    { id: 'light', label: '☀️ 浅色模式' },
    { id: 'dark', label: '🌙 深色模式' },
    { id: 'sepia', label: '📜 护眼模式' },
  ];

  const wallpapers = [
    { id: 'bamboo', label: '🎋 竹林', color: '#e8f5e9' },
    { id: 'starry', label: '🌟 星空', color: '#1a1a2e' },
    { id: 'sunset', label: '🌅 夕阳', color: '#fff3e0' },
    { id: 'ocean', label: '🌊 海洋', color: '#e3f2fd' },
  ];

  useEffect(() => {
    if (user) {
      setTheme(user.theme || 'light');
      setWallpaper(user.wallpaper || 'bamboo');
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings({ theme, wallpaper });
      alert('设置已保存！');
      // 刷新页面以应用新设置
      window.location.reload();
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ 设置</h1>
        <p>个性化您的写作空间</p>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2>🎨 主题设置</h2>
          <div className="themes-grid">
            {themes.map((t) => (
              <div
                key={t.id}
                className={`theme-option ${theme === t.id ? 'selected' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <div className={`theme-preview ${t.id}`} />
                <span className="theme-label">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h2>🌆 壁纸设置</h2>
          <div className="wallpapers-grid">
            {wallpapers.map((w) => (
              <div
                key={w.id}
                className={`wallpaper-option ${wallpaper === w.id ? 'selected' : ''}`}
                onClick={() => setWallpaper(w.id)}
              >
                <div 
                  className="wallpaper-preview"
                  style={{ backgroundColor: w.color }}
                />
                <span className="wallpaper-label">{w.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h2>👤 账户信息</h2>
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">用户名</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">邮箱</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>🔒 安全与隐私</h2>
          <div className="security-info">
            <div className="security-item">
              <div className="security-icon">🛡️</div>
              <div className="security-text">
                <h4>数据加密</h4>
                <p>您的数据安全存储在本地数据库中</p>
              </div>
            </div>
            <div className="security-item">
              <div className="security-icon">💾</div>
              <div className="security-text">
                <h4>自动备份</h4>
                <p>定期备份防止数据丢失</p>
              </div>
            </div>
            <div className="security-item">
              <div className="security-icon">🔑</div>
              <div className="security-text">
                <h4>隐私保护</h4>
                <p>您的创作内容完全私密</p>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2>💡 未来功能</h2>
          <div className="roadmap">
            <div className="roadmap-item upcoming">
              <div className="roadmap-status">🚧 开发中</div>
              <h4>思维导图</h4>
              <p>像幕布和XMind一样的大纲编辑</p>
            </div>
            <div className="roadmap-item upcoming">
              <div className="roadmap-status">📱 即将推出</div>
              <h4>移动端支持</h4>
              <p>iOS 和 Android 应用</p>
            </div>
            <div className="roadmap-item upcoming">
              <div className="roadmap-status">☁️ 规划中</div>
              <h4>云端同步</h4>
              <p>多设备协同，永不丢失</p>
            </div>
          </div>
        </section>

        <div className="settings-footer">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '保存中...' : '💾 保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
