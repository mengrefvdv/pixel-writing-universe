import React, { useEffect, useState } from 'react';
import './Celebrations.css';

interface CelebrationProps {
  show: boolean;
  message: string;
  type: 'xp' | 'level' | 'achievement' | 'streak';
  onComplete?: () => void;
}

const Celebrations: React.FC<CelebrationProps> = ({ show, message, type, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; style: React.CSSProperties }>>([]);

  useEffect(() => {
    if (show) {
      const emojis = ['⭐', '✨', '🎉', '🌟', '💫', '🎊'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${1 + Math.random()}s`,
        },
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="celebration-particle"
          style={particle.style}
        >
          {particle.emoji}
        </div>
      ))}
      
      <div className="celebration-message">
        <div className={`celebration-icon ${type}`}>
          {type === 'xp' && '⭐'}
          {type === 'level' && '🎊'}
          {type === 'achievement' && '🏆'}
          {type === 'streak' && '🔥'}
        </div>
        <div className="celebration-text">{message}</div>
      </div>

      {type === 'level' && <div className="level-up-ring"></div>}
    </div>
  );
};

export default Celebrations;
