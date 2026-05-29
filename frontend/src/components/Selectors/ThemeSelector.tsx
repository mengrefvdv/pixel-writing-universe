import React from 'react';
import { editorThemes } from '../../data/editorThemes';
import './ThemeSelector.css';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelect: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentThemeId, 
  onSelect 
}) => {
  return (
    <div className="theme-selector">
      <div className="selector-header">
        <h3>🎨 编辑器主题</h3>
      </div>

      <div className="theme-grid">
        {editorThemes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-item ${currentThemeId === theme.id ? 'active' : ''}`}
            onClick={() => onSelect(theme.id)}
          >
            <div 
              className="theme-preview"
              style={{
                background: theme.background
              }}
            >
              <div 
                className="theme-text"
                style={{ color: theme.textColor }}
              >
                Aa
              </div>
            </div>
            <div className="theme-info">
              <span className="theme-name">{theme.name}</span>
              <span className="theme-description">{theme.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
