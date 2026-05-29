import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Discover.css';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updated_at: string;
}

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('writing app');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTags = [
    'writing app',
    'notion clone',
    'markdown editor',
    'obsidian alternative',
    'novel writing',
    'blog platform',
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const data = await api.searchGitHub(query);
      setRepos(data);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Go: '#00ADD8',
      Rust: '#dea584',
      Vue: '#42b883',
      React: '#61dafb',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      'C#': '#178600',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Swift: '#F05138',
      Kotlin: '#A97BFF',
    };
    return colors[lang] || '#8b8b8b';
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1>🔍 发现</h1>
        <p>探索优秀的开源写作工具</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索项目..."
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          <button 
            className="search-btn"
            onClick={() => handleSearch(searchQuery)}
            disabled={loading}
          >
            {loading ? '搜索中...' : '🔍 搜索'}
          </button>
        </div>

        <div className="tag-list">
          <span className="tag-label">热门搜索:</span>
          {searchTags.map((tag) => (
            <button
              key={tag}
              className="search-tag"
              onClick={() => handleSearch(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="repos-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">🌀</div>
            <p>正在搜索中...</p>
          </div>
        ) : repos.length === 0 ? (
          <div className="empty-state">
            <p>没有找到相关项目</p>
          </div>
        ) : (
          repos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <div className="repo-header">
                <h3 className="repo-name">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </h3>
                <p className="repo-fullname">{repo.full_name}</p>
              </div>
              
              {repo.description && (
                <p className="repo-description">{repo.description}</p>
              )}

              <div className="repo-meta">
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <span>{repo.stars.toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🍴</span>
                  <span>{repo.forks.toLocaleString()}</span>
                </div>
                {repo.language && (
                  <div className="meta-item">
                    <span 
                      className="language-dot"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>更新于 {formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discover;
