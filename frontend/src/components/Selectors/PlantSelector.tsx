import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { plants, Plant } from '../../data/plants';
import './PlantSelector.css';

const PlantSelector: React.FC = () => {
  const { user, plants: unlockedPlants, activePlant, setActivePlant } = useGameStore();

  const getUnlockedPlants = (): Plant[] => {
    return plants.filter((plant) => user.level >= plant.unlockLevel);
  };

  const unlocked = getUnlockedPlants();
  const locked = plants.filter((plant) => user.level < plant.unlockLevel);

  return (
    <div className="selector-container">
      <h2>🌿 选择植物</h2>
      <p className="selector-desc">选择一株陪伴你的植物，它会随着你的写作成长</p>

      <div className="plants-grid">
        {unlocked.map((plant) => (
          <button
            key={plant.id}
            className={`plant-card ${activePlant?.id === plant.id ? 'selected' : ''}`}
            onClick={() => setActivePlant(plant)}
          >
            <div className="plant-emoji">{plant.emoji}</div>
            <div className="plant-details">
              <h3>{plant.name}</h3>
              <p>{plant.description}</p>
              <div className="plant-level">
                <span>解锁等级: {plant.unlockLevel}</span>
              </div>
            </div>
            {activePlant?.id === plant.id && (
              <div className="selected-badge">✓</div>
            )}
          </button>
        ))}
      </div>

      {locked.length > 0 && (
        <div className="locked-section">
          <h3>🔒 待解锁植物</h3>
          <div className="locked-grid">
            {locked.map((plant) => (
              <div key={plant.id} className="locked-card">
                <div className="locked-emoji">❓</div>
                <div className="locked-info">
                  <span className="locked-name">???</span>
                  <span className="locked-hint">等级 {plant.unlockLevel} 解锁</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantSelector;
