import React, { useState } from 'react';
import './UserSettings.css';
import WallpaperSelector from '../Selectors/WallpaperSelector';
import ThemeSelector from '../Selectors/ThemeSelector';

interface UserSettingsProps {
  onSave: (settings: Settings) => void;
  initialSettings?: Settings;
  editorTheme?: string;
  wallpaperId?: string;
  onEditorThemeChange?: (themeId: string) => void;
  onWallpaperChange?: (wallpaperId: string) => void;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  autoSave: boolean;
  autoSaveInterval: number;
  showWordCount: boolean;
  showXp: boolean;
  enableSounds: boolean;
  enableParticles: boolean;
  focusMode: boolean;
  writingGoal: number;
  dailyReminder: boolean;
  reminderTime: string;
}

const defaultSettings: Settings = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'Courier New',
  autoSave: true,
  autoSaveInterval: 30,
  showWordCount: true,
  showXp: true,
  enableSounds: false,
  enableParticles: true,
  focusMode: false,
  writingGoal: 1000,
  dailyReminder: false,
  reminderTime: '20:00',
};

const UserSettings: React.FC<UserSettingsProps> = ({ 
  onSave, 
  initialSettings,
  editorTheme = 'classic-dark',
  wallpaperId = 'forest-morning',
  onEditorThemeChange,
  onWallpaperChange
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings || defaultSettings);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    onSave(settings);
  };

  const tabs = [
    { id: 'appearance', label: '外观', icon: '🎨' },
    { id: 'editor', label: '编辑器', icon: '✍️' },
    { id: 'game', label: '游戏化', icon: '🎮' },
    { id: 'notifications', label: '通知', icon: '🔔' },
    { id: 'data', label: '数据', icon: '💾' },
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ 设置</h2>
        <p>自定义你的像素码字宇宙</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>🎨 外观设置</h3>
              
              <div className="setting-item">
                <label>主题</label>
                <div className="theme-options">
                  <button
                    className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleChange('theme', 'light')}
                  >
                    ☀️ 浅色
                  </button>
                  <button
                    className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleChange('theme', 'dark')}
                  >
                    🌙 深色
                  </button>
                  <button
                    className={`theme-option ${settings.theme === 'auto' ? 'active' : ''}`}
                    onClick={() => handleChange('theme', 'auto')}
                  >
                    ⚡ 自动
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label>字体大小</label>
                <div className="font-options">
                  <button
                    className={`font-option ${settings.fontSize === 'small' ? 'active' : ''}`}
                    onClick={() => handleChange('fontSize', 'small')}
                  >
                    小
                  </button>
                  <button
                    className={`font-option ${settings.fontSize === 'medium' ? 'active' : ''}`}
                    onClick={() => handleChange('fontSize', 'medium')}
                  >
                    中
                  </button>
                  <button
                    className={`font-option ${settings.fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => handleChange('fontSize', 'large')}
                  >
                    大
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label>启用粒子效果</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableParticles}
                    onChange={(e) => handleChange('enableParticles', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="setting-item">
                <label>壁纸选择</label>
                <WallpaperSelector
                  currentWallpaperId={wallpaperId}
                  onSelect={(id) => onWallpaperChange?.(id)}
                />
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="settings-section">
              <h3>✍️ 编辑器设置</h3>
              
              <div className="setting-item">
                <label>自动保存</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleChange('autoSave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              {settings.autoSave && (
                <div className="setting-item">
                  <label>保存间隔（秒）</label>
                  <input
                    type="number"
                    className="pixel-input small"
                    value={settings.autoSaveInterval}
                    onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value))}
                    min="10"
                    max="300"
                  />
                </div>
              )}

              <div className="setting-item">
                <label>显示字数统计</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showWordCount}
                    onChange={(e) => handleChange('showWordCount', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="setting-item">
                <label>每日写作目标（字）</label>
                <input
                  type="number"
                  className="pixel-input small"
                  value={settings.writingGoal}
                  onChange={(e) => handleChange('writingGoal', parseInt(e.target.value))}
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>

              <div className="setting-item">
                <label>专注模式</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.focusMode}
                    onChange={(e) => handleChange('focusMode', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="setting-item">
                <label>编辑器主题</label>
                <ThemeSelector
                  currentThemeId={editorTheme}
                  onSelect={(id) => onEditorThemeChange?.(id)}
                />
              </div>
            </div>
          )}

          {activeTab === 'game' && (
            <div className="settings-section">
              <h3>🎮 游戏化设置</h3>
              
              <div className="setting-item">
                <label>显示 XP 和等级</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.showXp}
                    onChange={(e) => handleChange('showXp', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="setting-item">
                <label>启用音效</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.enableSounds}
                    onChange={(e) => handleChange('enableSounds', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              <div className="game-stats">
                <h4>📊 游戏数据</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">当前等级</span>
                    <span className="stat-value">1</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">📝</span>
                    <span className="stat-label">累计字数</span>
                    <span className="stat-value">0</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-label">连续天数</span>
                    <span className="stat-value">0</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-label">已解锁成就</span>
                    <span className="stat-value">0/10</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>🔔 通知设置</h3>
              
              <div className="setting-item">
                <label>每日提醒</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.dailyReminder}
                    onChange={(e) => handleChange('dailyReminder', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </div>

              {settings.dailyReminder && (
                <div className="setting-item">
                  <label>提醒时间</label>
                  <input
                    type="time"
                    className="pixel-input small"
                    value={settings.reminderTime}
                    onChange={(e) => handleChange('reminderTime', e.target.value)}
                  />
                </div>
              )}

              <div className="notification-preview">
                <div className="preview-card">
                  <span className="preview-icon">🌙</span>
                  <div className="preview-content">
                    <h4>晚安，作家~</h4>
                    <p>今天还没有写作呢，要来写点什么吗？</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="settings-section">
              <h3>💾 数据管理</h3>
              
              <div className="setting-item">
                <label>导出数据</label>
                <button className="pixel-btn secondary">
                  📤 导出所有数据
                </button>
              </div>

              <div className="setting-item">
                <label>导入数据</label>
                <button className="pixel-btn secondary">
                  📥 导入数据
                </button>
              </div>

              <div className="setting-item danger">
                <label>清除所有数据</label>
                <button className="pixel-btn danger">
                  ⚠️ 清除数据
                </button>
              </div>

              <div className="data-info">
                <p>💡 你的所有写作数据都保存在本地。</p>
                <p>⚠️ 清除数据后无法恢复，请谨慎操作。</p>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button className="pixel-btn secondary" onClick={() => setSettings(defaultSettings)}>
              重置默认
            </button>
            <button className="pixel-btn primary" onClick={handleSave}>
              保存设置 ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
