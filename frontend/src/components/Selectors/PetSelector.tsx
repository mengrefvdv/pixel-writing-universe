import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { pets, Pet } from '../../data/pets';
import './PetSelector.css';

const PetSelector: React.FC = () => {
  const { user, pets: unlockedPets, activePet, setActivePet } = useGameStore();

  const getUnlockedPets = (): Pet[] => {
    return pets.filter((pet) => user.level >= pet.unlockLevel);
  };

  const unlocked = getUnlockedPets();
  const locked = pets.filter((pet) => user.level < pet.unlockLevel);

  return (
    <div className="selector-container">
      <h2>🐾 选择宠物</h2>
      <p className="selector-desc">选择一只陪伴你的宠物，它会在你写作时互动</p>

      <div className="pets-grid">
        {unlocked.map((pet) => (
          <button
            key={pet.id}
            className={`pet-card ${activePet?.id === pet.id ? 'selected' : ''}`}
            onClick={() => setActivePet(pet)}
          >
            <div className="pet-emoji">{pet.emoji}</div>
            <div className="pet-details">
              <h3>{pet.name}</h3>
              <p className="pet-personality">个性: {pet.personality}</p>
              <p className="pet-desc">{pet.description}</p>
              <div className="pet-level">
                <span>解锁等级: {pet.unlockLevel}</span>
              </div>
            </div>
            {activePet?.id === pet.id && (
              <div className="selected-badge">✓</div>
            )}
          </button>
        ))}
      </div>

      {locked.length > 0 && (
        <div className="locked-section">
          <h3>🔒 待解锁宠物</h3>
          <div className="locked-grid">
            {locked.map((pet) => (
              <div key={pet.id} className="locked-card">
                <div className="locked-emoji">❓</div>
                <div className="locked-info">
                  <span className="locked-name">???</span>
                  <span className="locked-hint">等级 {pet.unlockLevel} 解锁</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSelector;
