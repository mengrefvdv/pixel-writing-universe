import React, { useState } from 'react';
import { api } from '../../services/api';
import './Tools.css';

const Tools: React.FC = () => {
  const [generatedName, setGeneratedName] = useState('');
  const [namePrefix, setNamePrefix] = useState('作品');
  const [generatingName, setGeneratingName] = useState(false);

  const [chatProvider, setChatProvider] = useState('merlin');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  const handleGenerateName = async () => {
    setGeneratingName(true);
    try {
      const data = await api.generateName(namePrefix);
      setGeneratedName(data.name);
    } catch (error) {
      console.error('生成名字失败:', error);
    } finally {
      setGeneratingName(false);
    }
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(generatedName);
    alert('已复制到剪贴板！');
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    setChatLoading(true);
    setChatResponse('');

    try {
      const data = await api.chatWithExternal(chatProvider, chatMessage);
      setChatResponse(data.response);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('聊天失败:', error);
      setChatResponse('抱歉，出错了，请稍后再试。');
    } finally {
      setChatLoading(false);
      setChatMessage('');
    }
  };

  return (
    <div className="tools-container">
      <div className="tools-header">
        <h1>🔧 工具箱</h1>
        <p>为你的创作提供助力</p>
      </div>

      <div className="tools-grid">
        <div className="tool-card">
          <div className="tool-icon">🎨</div>
          <h2>智能起名器</h2>
          <p>为你的作品生成独特的名字</p>
          
          <div className="name-generator">
            <div className="name-input">
              <label>前缀</label>
              <input
                type="text"
                value={namePrefix}
                onChange={(e) => setNamePrefix(e.target.value)}
                placeholder="作品"
              />
            </div>
            
            <button 
              className="generate-btn"
              onClick={handleGenerateName}
              disabled={generatingName}
            >
              {generatingName ? '生成中...' : '✨ 生成名字'}
            </button>

            {generatedName && (
              <div className="generated-name">
                <div className="name-display">
                  <span className="name-text">{generatedName}</span>
                  <button className="copy-btn" onClick={handleCopyName}>
                    📋 复制
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🤖</div>
          <h2>AI 助手</h2>
          <p>获取智能写作建议和灵感</p>
          
          <div className="chat-section">
            <div className="provider-select">
              <label>选择 AI</label>
              <select
                value={chatProvider}
                onChange={(e) => setChatProvider(e.target.value)}
              >
                <option value="merlin">🧙 Merlin</option>
                <option value="chatgpt">💬 ChatGPT</option>
                <option value="generic">📝 通用</option>
              </select>
            </div>

            <div className="chat-history">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <span className="msg-role">{msg.role === 'user' ? '👤' : '🤖'}</span>
                  <span className="msg-content">{msg.content}</span>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="输入你的问题..."
                onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && handleChat()}
              />
              <button 
                className="send-btn"
                onClick={handleChat}
                disabled={chatLoading}
              >
                {chatLoading ? '发送中...' : '➤'}
              </button>
            </div>
          </div>
        </div>

        <div className="tool-card">
          <div className="tool-icon">📐</div>
          <h2>写作助手</h2>
          <p>常用写作工具集合</p>
          
          <div className="writing-tools">
            <div className="tool-item">
              <span className="tool-emoji">✂️</span>
              <div className="tool-text">
                <h4>字数统计</h4>
                <p>实时统计文章字数和字符</p>
              </div>
            </div>
            <div className="tool-item">
              <span className="tool-emoji">🔍</span>
              <div className="tool-text">
                <h4>同义词查询</h4>
                <p>查找合适的替代词</p>
              </div>
            </div>
            <div className="tool-item">
              <span className="tool-emoji">🎯</span>
              <div className="tool-text">
                <h4>目标规划</h4>
                <p>设定每日写作目标</p>
              </div>
            </div>
            <div className="tool-item">
              <span className="tool-emoji">📊</span>
              <div className="tool-text">
                <h4>进度追踪</h4>
                <p>记录写作进度和成长</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
