import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { getGrowthStage, getStageName } from '../../data/plants';
import './Plant.css';

interface PlantProps {
  size?: number;
}

const PlantComponent: React.FC<PlantProps> = ({ size = 80 }) => {
  const { activePlant, user } = useGameStore();
  const [stage, setStage] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);

  useEffect(() => {
    if (activePlant) {
      const newStage = getGrowthStage(activePlant, user.totalWords);
      if (newStage > stage) {
        setIsGrowing(true);
        setTimeout(() => {
          setStage(newStage);
          setIsGrowing(false);
        }, 500);
      } else {
        setStage(newStage);
      }
    }
  }, [activePlant, user.totalWords, stage]);

  if (!activePlant) {
    return (
      <div className="plant-container" style={{ width: size, height: size }}>
        <div className="plant-empty">
          <span>🌱</span>
          <p>选择一株植物开始</p>
        </div>
      </div>
    );
  }

  const stageName = getStageName(stage);
  const stageEmojis = ['🌰', '🌱', '🌿', '🌸', '✨'];

  return (
    <div className="plant-container" style={{ width: size, height: size }}>
      <div className={`plant plant-stage-${stage} ${isGrowing ? 'growing' : ''}`}>
        <div className="plant-pot">
          <div className="pot-body"></div>
          <div className="pot-rim"></div>
        </div>
        
        <div className={`plant-stem ${stage >= 1 ? 'visible' : ''}`}>
          <div className="stem-part" style={{ height: `${stage * 15 + 20}px` }}></div>
          
          {stage >= 1 && (
            <div className="leaves">
              {[...Array(Math.min(stage + 1, 5))].map((_, i) => (
                <div
                  key={i}
                  className={`leaf leaf-${i}`}
                  style={{
                    transform: `rotate(${(i % 2 === 0 ? -30 : 30) + i * 10}deg)`,
                    top: `${i * 15}px`,
                  }}
                ></div>
              ))}
            </div>
          )}
          
          {stage >= 3 && (
            <div className="flowers">
              {[...Array(stage - 2)].map((_, i) => (
                <div key={i} className="flower" style={{ left: `${-20 + i * 20}px` }}>
                  <div className="flower-center"></div>
                  <div className="flower-petals">
                    <span>🌸</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {stage >= 4 && (
            <div className="glow-effect">
              <div className="glow-ring"></div>
              <div className="glow-particles">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="particle"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      left: `${Math.random() * 100}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="plant-emoji" style={{ fontSize: `${size * 0.4}px` }}>
          {stageEmojis[stage]}
        </div>
      </div>
      
      <div className="plant-info">
        <div className="plant-name">{activePlant.emoji} {activePlant.name}</div>
        <div className="plant-stage">
          <div className="stage-bar">
            <div
              className="stage-progress"
              style={{ width: `${(stage / 4) * 100}%` }}
            ></div>
          </div>
          <span className="stage-text">{stageName}</span>
        </div>
        <div className="plant-stats">
          <span>🌱 {user.totalWords.toLocaleString()} 字</span>
        </div>
      </div>
    </div>
  );
};

export default PlantComponent;
