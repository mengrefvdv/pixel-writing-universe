import React, { useState } from 'react';
import { api } from '../../services/api';
import './Login.css';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container pixel-login">
      <div className="login-header">
        <div className="logo-icon">💻</div>
        <h1 className="pixel-title">像素码字</h1>
        <p className="pixel-subtitle">Pixel Writer</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="pixel-label">📧 邮箱</label>
          <input
            type="email"
            className="pixel-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入你的邮箱..."
            required
          />
        </div>

        <div className="form-group">
          <label className="pixel-label">🔐 密码</label>
          <input
            type="password"
            className="pixel-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入你的密码..."
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="pixel-btn primary large"
          disabled={loading}
        >
          {loading ? '🔄 登录中...' : '🎮 登录'}
        </button>

        <div className="form-footer">
          <p>还没有账号?</p>
          <button 
            type="button"
            className="pixel-btn secondary"
            onClick={onSwitchToRegister}
          >
            ✨ 注册新账号
          </button>
        </div>
      </form>

      <div className="login-tips">
        <div className="tip">
          <span>🌟</span>
          <span>为享受孤独的创作者打造</span>
        </div>
        <div className="tip">
          <span>🌱</span>
          <span>每一个字都是生命的养分</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
