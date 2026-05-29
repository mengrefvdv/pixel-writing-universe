import React, { useEffect, useRef, useState } from 'react';
import './RoomEnhancements.css';

interface ParallaxLayer {
  id: string;
  depth: number;
  content: React.ReactNode;
}

interface RoomEnhancementsProps {
  theme: 'day' | 'dusk' | 'night' | 'rain' | 'snow' | 'tokyo';
  children?: React.ReactNode;
}

const ParallaxLayer: React.FC<{ layer: ParallaxLayer; mouseX: number; mouseY: number }> = ({ layer, mouseX, mouseY }) => {
  const moveX = (mouseX - 0.5) * layer.depth * 30;
  const moveY = (mouseY - 0.5) * layer.depth * 20;

  return (
    <div
      className="parallax-layer"
      style={{
        transform: `translate(${moveX}px, ${moveY}px)`,
        zIndex: layer.depth,
      }}
    >
      {layer.content}
    </div>
  );
};

const AmbientParticles: React.FC<{ theme: string }> = ({ theme }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  if (theme !== 'snow') return null;

  return (
    <div className="ambient-particles snow">
      {particles.map((p) => (
        <div
          key={p.id}
          className="snow-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const RainEffect: React.FC = () => {
  const [raindrops, setRaindrops] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const drops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
    }));
    setRaindrops(drops);
  }, []);

  return (
    <div className="rain-effect">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const WindowGlow: React.FC<{ theme: string }> = ({ theme }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    if (theme === 'night' || theme === 'tokyo') {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 3,
      }));
      setStars(newStars);
    }
  }, [theme]);

  if (theme !== 'night' && theme !== 'tokyo') return null;

  return (
    <div className="window-glow">
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      {theme === 'night' && <div className="moon" />}
      {theme === 'tokyo' && (
        <div className="tokyo-lights">
          <div className="light-buldings">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="building" style={{ height: `${40 + Math.random() * 60}px` }}>
                <div className="windows">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div
                      key={j}
                      className="window-light"
                      style={{
                        animationDelay: `${Math.random() * 2}s`,
                        background: Math.random() > 0.5 ? '#f4d03f' : '#4ecdc4',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LightSource: React.FC<{ theme: string }> = ({ theme }) => {
  const getLightColor = () => {
    switch (theme) {
      case 'day': return 'rgba(255, 255, 220, 0.3)';
      case 'dusk': return 'rgba(255, 165, 100, 0.4)';
      case 'night': return 'rgba(100, 100, 150, 0.2)';
      case 'rain': return 'rgba(150, 150, 180, 0.3)';
      case 'snow': return 'rgba(200, 200, 220, 0.3)';
      case 'tokyo': return 'rgba(255, 100, 150, 0.3)';
      default: return 'rgba(255, 255, 220, 0.3)';
    }
  };

  return (
    <div
      className="light-source"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${getLightColor()} 0%, transparent 70%)`,
      }}
    />
  );
};

const DepthOfField: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="depth-of-field">
      <div className="dof-blur-back">{children}</div>
      <div className="dof-focus">
        <div className="dof-sharpen">{children}</div>
      </div>
    </div>
  );
};

const BreathingElements: React.FC = () => {
  return (
    <div className="breathing-elements">
      <div className="breathe-slow plant">
        <span>🌿</span>
      </div>
      <div className="breathe-medium curtain">
        <span>💨</span>
      </div>
      <div className="breathe-fast lamp">
        <span>💡</span>
      </div>
    </div>
  );
};

const RoomEnhancements: React.FC<RoomEnhancementsProps> = ({ theme, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const layers: ParallaxLayer[] = [
    { id: 'back', depth: 0.2, content: <div className="layer-back" /> },
    { id: 'mid', depth: 0.5, content: <div className="layer-mid" /> },
    { id: 'front', depth: 0.8, content: <div className="layer-front" /> },
  ];

  return (
    <div ref={containerRef} className={`room-enhancement theme-${theme}`}>
      <LightSource theme={theme} />
      
      <div className="parallax-container">
        {layers.map((layer) => (
          <ParallaxLayer
            key={layer.id}
            layer={layer}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
        ))}
      </div>

      <WindowGlow theme={theme} />
      <AmbientParticles theme={theme} />
      {theme === 'rain' && <RainEffect />}
      <BreathingElements />
      <DepthOfField>{children}</DepthOfField>
      
      <div className="vignette" />
    </div>
  );
};

export default RoomEnhancements;
