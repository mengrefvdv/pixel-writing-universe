import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import './Achievements.css';

const AchievementsComponent: React.FC = () => {
  const { achievements, user } = useGameStore();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>🏆 成就系统</h2>
        <div className="progress-info">
          <span>已解锁: {unlockedCount}/{totalCount}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(unlockedCount / totalCount) * 100}%` }}></div>
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{user.level}</span>
            <span className="stat-label">等级</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{user.xp}</span>
            <span className="stat-label">经验值</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{user.currentStreak}</span>
            <span className="stat-label">连续天数</span>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-emoji">
              {achievement.unlocked ? achievement.emoji : '❓'}
            </div>
            
            <div className="achievement-content">
              <h3 className="achievement-name">
                {achievement.unlocked ? achievement.name : '???'}
              </h3>
              <p className="achievement-desc">
                {achievement.unlocked ? achievement.description : '完成特定条件解锁'}
              </p>
              
              {!achievement.unlocked && (
                <div className="progress-indicator">
                  <div className="mini-progress-bar">
                    <div 
                      className="mini-progress-fill" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{Math.round(achievement.progress)}%</span>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="achievement-reward">
                  <span className="reward-label">奖励:</span>
                  <span className="reward-value">
                    {achievement.reward.type === 'plant' && '🌿 新植物'}
                    {achievement.reward.type === 'pet' && '🐾 新宠物'}
                    {achievement.reward.type === 'theme' && '🎨 新主题'}
                    {achievement.reward.type === 'xp' && `⭐ ${achievement.reward.value} XP`}
                  </span>
                </div>
              )}
            </div>
            
            {achievement.unlocked && (
              <div className="unlock-badge">
                <span>✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsComponent;
