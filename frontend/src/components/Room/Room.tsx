import React, { useState } from 'react';
import './Room.css';

interface RoomProps {
  onStartWriting: () => void;
}

const Room: React.FC<RoomProps> = ({ onStartWriting }) => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showComputer, setShowComputer] = useState(false);

  const handleObjectClick = (object: string) => {
    setSelectedObject(object);
    
    if (object === 'computer') {
      setShowComputer(true);
    }
  };

  const handleCloseComputer = () => {
    setShowComputer(false);
    setSelectedObject(null);
  };

  return (
    <div className="room-container">
      <div className="room-scene">
        {/* 背景星空 */}
        <div className="stars"></div>
        
        {/* 房间框架 */}
        <div className="room">
          {/* 天花板 */}
          <div className="ceiling"></div>
          
          {/* 墙壁 */}
          <div className="walls">
            <div className="left-wall"></div>
            <div className="right-wall"></div>
            <div className="back-wall"></div>
          </div>
          
          {/* 地板 */}
          <div className="floor"></div>
          
          {/* 书架 */}
          <div className="bookshelf" onClick={() => handleObjectClick('bookshelf')}>
            <div className="shelf">
              <div className="book book1"></div>
              <div className="book book2"></div>
              <div className="book book3"></div>
              <div className="book book4"></div>
            </div>
            <div className="shelf">
              <div className="plant"></div>
              <div className="book book5"></div>
              <div className="book book6"></div>
            </div>
          </div>
          
          {/* 桌子 */}
          <div className="desk" onClick={() => handleObjectClick('desk')}>
            <div className="desk-top"></div>
            <div className="desk-leg left"></div>
            <div className="desk-leg right"></div>
            
            {/* 桌上的电脑 */}
            <div 
              className="computer" 
              onClick={(e) => { e.stopPropagation(); handleObjectClick('computer'); }}
            >
              <div className="monitor">
                <div className="screen">
                  <div className="screen-content">
                    <span>像素</span>
                    <span>码字</span>
                  </div>
                </div>
              </div>
              <div className="keyboard"></div>
            </div>
          </div>
          
          {/* 椅子 */}
          <div className="chair" onClick={() => handleObjectClick('chair')}>
            <div className="seat"></div>
            <div className="back"></div>
            <div className="chair-leg"></div>
          </div>
          
          {/* 窗户 - 白色窗框配蓝色窗帘 */}
          <div className="window">
            <div className="window-frame"></div>
            
            {/* 蓝色窗帘 */}
            <div className="curtain-left">
              <div className="curtain-tieback"></div>
            </div>
            <div className="curtain-right">
              <div className="curtain-tieback"></div>
            </div>
            
            {/* 窗台 */}
            <div className="window-sill"></div>
            
            {/* 窗台上的盆栽 */}
            <div className="windowsill-plant">
              <div className="plant-pot"></div>
              <div className="plant-leaves">🌿</div>
            </div>
          </div>
          
          {/* 地板上的地毯 */}
          <div className="rug"></div>
          
          {/* 地板上的小植物 */}
          <div className="floor-plant"></div>
        </div>
        
        {/* 交互提示 */}
        <div className="hint">
          {selectedObject ? (
            <div className="hint-text">
              点击了: {selectedObject === 'computer' ? '💻 电脑 - 点击进入' : 
                       selectedObject === 'bookshelf' ? '📚 书架' :
                       selectedObject === 'desk' ? '🪑 书桌' : '🪑 椅子'}
            </div>
          ) : (
            <div className="hint-text">
              ✨ 点击房间中的物品探索
            </div>
          )}
        </div>
      </div>
      
      {/* 电脑屏幕弹出层 */}
      {showComputer && (
        <div className="computer-overlay" onClick={handleCloseComputer}>
          <div className="computer-screen pixel-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseComputer}>×</button>
            
            <div className="welcome-screen">
              <div className="logo">✍️</div>
              <h1>像素码字</h1>
              <p>Pixel Writing Universe</p>
              <p className="tagline">为享受孤独的人打造的写作工具</p>
              
              <button className="pixel-btn primary large" onClick={onStartWriting}>
                🚀 开始码字
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 项目名称 */}
      <div className="project-title">
        <h1>📚 像素码字</h1>
        <p>Pixel Writer</p>
      </div>
    </div>
  );
};

export default Room;
