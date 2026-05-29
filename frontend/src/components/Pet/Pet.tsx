import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { getRandomAction } from '../../data/pets';
import './Pet.css';

interface PetProps {
  size?: number;
  draggable?: boolean;
}

const PetComponent: React.FC<PetProps> = ({ size = 60, draggable = true }) => {
  const { activePet, user, setPetPosition, petPosition, setCurrentAction, currentAction } = useGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(petPosition);
  const [action, setAction] = useState<string | null>(currentAction);
  const dragRef = useRef<{ startX: number; startY: number; petX: number; petY: number } | null>(null);

  useEffect(() => {
    if (activePet && user.totalWords > 0) {
      // Trigger action every 500 words written
      const interval = setInterval(() => {
        const randomAction = getRandomAction(activePet, user.totalWords);
        if (randomAction && !isDragging) {
          setAction(randomAction.id);
          setCurrentAction(randomAction.id);
          
          setTimeout(() => {
            setAction(null);
            setCurrentAction(null);
          }, 3000);
        }
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [activePet, user.totalWords, isDragging, setCurrentAction]);

  useEffect(() => {
    setPosition(petPosition);
  }, [petPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      petX: position.x,
      petY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(100, dragRef.current.petX + (deltaX / window.innerWidth) * 100));
      const newY = Math.max(0, Math.min(100, dragRef.current.petY + (deltaY / window.innerHeight) * 100));
      
      setPosition({ x: newX, y: newY });
      setPetPosition(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setPetPosition]);

  if (!activePet) {
    return (
      <div className="pet-container" style={{ width: size, height: size }}>
        <div className="pet-empty">
          <span>🐾</span>
          <p>选择一只宠物陪伴</p>
        </div>
      </div>
    );
  }

  const getActionClass = () => {
    switch (action) {
      case 'sleep': return 'pet-sleeping';
      case 'wag': return 'pet-wagging';
      case 'jump': return 'pet-jumping';
      case 'spin': return 'pet-spinning';
      case 'float': return 'pet-floating';
      case 'glow': return 'pet-glowing';
      default: return '';
    }
  };

  return (
    <div
      className={`pet-container ${getActionClass()} ${isDragging ? 'dragging' : ''}`}
      style={{
        width: size,
        height: size,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="pet-body">
        <div className={`pet-emoji ${isDragging ? 'pet-grabbing' : ''}`} 
             style={{ fontSize: `${size * 0.8}px` }}>
          {action === 'sleep' ? '😴' : activePet.emoji}
        </div>
        
        {action === 'wag' && (
          <div className="tail wagging">🐾</div>
        )}
        
        {action === 'glow' && (
          <div className="pet-glow">
            <div className="glow-ring"></div>
          </div>
        )}
      </div>
      
      {!isDragging && (
        <div className="pet-thought">
          <div className="thought-bubble">
            <span>💭</span>
          </div>
        </div>
      )}
      
      <div className="pet-info">
        <div className="pet-name">{activePet.emoji} {activePet.name}</div>
        <div className="pet-personality">{activePet.personality}</div>
      </div>
    </div>
  );
};

export default PetComponent;
