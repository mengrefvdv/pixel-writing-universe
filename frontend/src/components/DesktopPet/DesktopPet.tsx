import React, { useState, useRef, useEffect } from 'react';
import './DesktopPet.css';

interface DesktopPetProps {
  petType: 'tree' | 'flower' | 'cat' | 'dog' | 'penguin';
  wordCount: number;
}

interface Position {
  x: number;
  y: number;
}

const DesktopPet: React.FC<DesktopPetProps> = ({ petType, wordCount }) => {
  const [position, setPosition] = useState<Position>({ 
    x: window.innerWidth - 150, 
    y: window.innerHeight - 200 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isHappy, setIsHappy] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [blinkCounter, setBlinkCounter] = useState(0);
  
  const petRef = useRef<HTMLDivElement>(null);
  const lastWordCount = useRef(wordCount);

  const getPetSize = () => {
    if (wordCount < 100) return 1;
    if (wordCount < 500) return 1.3;
    if (wordCount < 1000) return 1.6;
    if (wordCount < 2000) return 2;
    if (wordCount < 5000) return 2.5;
    return 3;
  };

  const getPetEmoji = () => {
    const size = getPetSize();
    let emoji = '';
    switch (petType) {
      case 'tree':
        emoji = size < 1.3 ? '🌱' : size < 2 ? '🌿' : size < 2.5 ? '🌳' : '🌲';
        break;
      case 'flower':
        emoji = size < 1.3 ? '🌱' : size < 2 ? '🌷' : size < 2.5 ? '🌸' : '💐';
        break;
      case 'cat':
        emoji = size < 1.3 ? '🐱' : size < 2 ? '😺' : size < 2.5 ? '🐈' : '🦁';
        break;
      case 'dog':
        emoji = size < 1.3 ? '🐕' : size < 2 ? '🐶' : size < 2.5 ? '🦮' : '🐺';
        break;
      case 'penguin':
        emoji = size < 1.3 ? '🐧' : size < 2 ? '🐦‍⬛' : size < 2.5 ? '🦜' : '🦅';
        break;
      default:
        emoji = '🌱';
    }
    return emoji;
  };

  const getPetName = () => {
    const names: Record<string, string> = {
      tree: '小树',
      flower: '郁金香',
      cat: '小猫',
      dog: '小狗',
      penguin: '企鹅'
    };
    return names[petType] || '伙伴';
  };

  useEffect(() => {
    if (wordCount > lastWordCount.current && wordCount - lastWordCount.current >= 50) {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 2000);
    }
    lastWordCount.current = wordCount;
  }, [wordCount]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkCounter(prev => (prev + 1) % 5);
    }, 4000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const savedPos = localStorage.getItem('petPosition');
    if (savedPos) {
      setPosition(JSON.parse(savedPos));
    }
  }, []);

  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('petPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!petRef.current) return;
    setIsDragging(true);
    const rect = petRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const getLevelText = () => {
    if (wordCount < 100) return 'Lv.1 初出茅庐';
    if (wordCount < 500) return 'Lv.2 小试牛刀';
    if (wordCount < 1000) return 'Lv.3 渐入佳境';
    if (wordCount < 2000) return 'Lv.4 得心应手';
    if (wordCount < 5000) return 'Lv.5 炉火纯青';
    return 'Lv.MAX 大师境界';
  };

  return (
    <>
      <div
        ref={petRef}
        className={`desktop-pet ${isDragging ? 'dragging' : ''} ${isHappy ? 'happy' : ''} ${blinkCounter === 0 ? 'blinking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          fontSize: `${getPetSize() * 2.5}rem`
        }}
        onMouseDown={handleMouseDown}
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="pet-shadow"></div>
        <div className="pet-emoji">
          {getPetEmoji()}
        </div>
        <div className="pet-name">
          {getPetName()}
        </div>
        {isHappy && (
          <div className="happy-particles">
            ✨
          </div>
        )}
        
        {showInfo && (
          <div className="pet-info-popup pixel-card">
            <div className="info-header">
              <h4>🌱 {getPetName()}的状态</h4>
              <button 
                className="close-btn"
                onClick={(e) => { e.stopPropagation(); setShowInfo(false); }}
              >
                ×
              </button>
            </div>
            <div className="info-content">
              <div className="info-item">
                <span className="info-label">等级</span>
                <span className="info-value">{getLevelText()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">已码字</span>
                <span className="info-value">{wordCount.toLocaleString()} 字</span>
              </div>
              <div className="info-item">
                <span className="info-label">成长进度</span>
                <div className="mini-progress">
                  <div 
                    className="mini-progress-fill"
                    style={{ width: `${Math.min((wordCount / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="info-tip">
                💡 写更多字让我成长哦！
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="pet-instruction">
        👆 拖拽我到任意位置 · 点击查看详情
      </div>
    </>
  );
};

export default DesktopPet;
