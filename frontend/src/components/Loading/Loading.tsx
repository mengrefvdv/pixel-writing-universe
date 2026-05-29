import React, { useEffect, useState } from 'react';
import './Loading.css';

interface LoadingProps {
  onComplete?: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('正在初始化...');

  useEffect(() => {
    const messages = [
      '正在初始化...',
      '加载房间场景...',
      '准备编辑器...',
      '加载宠物系统...',
      '加载成就系统...',
      '准备就绪 ✨',
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);
      
      const messageIndex = Math.floor((currentProgress / 100) * messages.length);
      setLoadingText(messages[Math.min(messageIndex, messages.length - 1)]);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 800);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">✍️</div>
          <h1>像素码字</h1>
          <p>Pixel Writing Universe</p>
        </div>

        <div className="loading-progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        <div className="loading-message">{loadingText}</div>

        <div className="loading-tips">
          <p>💡 小提示：写作时宠物会陪伴你哦~</p>
        </div>

        <div className="loading-animation">
          <div className="floating-elements">
            <span className="float-1">🌱</span>
            <span className="float-2">⭐</span>
            <span className="float-3">✨</span>
            <span className="float-4">🐾</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
