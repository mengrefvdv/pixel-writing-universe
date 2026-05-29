import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import DesktopPet from '../DesktopPet/DesktopPet';
import './Editor.css';

interface EditorProps {
  article?: any;
}

const Editor: React.FC<EditorProps> = ({ article }) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [status, setStatus] = useState(article?.status || 'draft');
  const [saving, setSaving] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(1);
  
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('retro');
  const [selectedPet, setSelectedPet] = useState('tree');
  const [totalWords, setTotalWords] = useState(0);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const fontOptions = [
    { id: 'retro', label: '🎮 像素字体' },
    { id: 'mono', label: '💻 等宽字体' },
    { id: 'serif', label: '📚 衬线字体' },
    { id: 'sans', label: '✍️ 无衬线' },
  ];

  const petOptions = [
    { id: 'tree', label: '🌳 小树' },
    { id: 'flower', label: '🌷 郁金香' },
    { id: 'cat', label: '🐱 小猫' },
    { id: 'dog', label: '🐕 小狗' },
    { id: 'penguin', label: '🐧 企鹅' },
  ];

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setStatus(article.status);
    }
    updateWordCount();
  }, [article]);

  const updateWordCount = () => {
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.split(/\s+/).filter((w: string) => w).length);
    setTotalWords(chineseChars + englishWords);
  };

  const countWords = () => {
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (content.split(/\s+/).filter((w: string) => w).length);
    const totalChars = content.length;
    const readingTime = Math.ceil((chineseChars + englishWords * 5) / 300);
    
    return {
      chinese: chineseChars,
      english: englishWords,
      total: chineseChars + englishWords,
      chars: totalChars,
      readingTime,
    };
  };

  const wordStats = countWords();

  const getPetSize = () => {
    const words = wordStats.total;
    if (words < 100) return 1;
    if (words < 500) return 1.3;
    if (words < 1000) return 1.6;
    if (words < 2000) return 2;
    if (words < 5000) return 2.5;
    return 3;
  };

  const getPetEmoji = () => {
    const size = getPetSize();
    let emoji = '';
    switch (selectedPet) {
      case 'tree':
        emoji = size < 1.3 ? '🌱' : size < 2 ? '🌿' : size < 2.5 ? '🌳' : '🌲';
        break;
      case 'flower':
        emoji = size < 1.3 ? '🌱' : size < 2 ? '🌷' : size < 2.5 ? '🌸' : '💐';
        break;
      case 'cat':
        emoji = size < 1.3 ? '🐱' : size < 2 ? '😺' : size < 2.5 ? '🐈' : '🦁';
        break;
      case 'dog':
        emoji = size < 1.3 ? '🐕' : size < 2 ? '🐶' : size < 2.5 ? '🦮' : '🐺';
        break;
      case 'penguin':
        emoji = size < 1.3 ? '🐧' : size < 2 ? '🐦‍⬛' : size < 2.5 ? '🦜' : '🦅';
        break;
      default:
        emoji = '🌱';
    }
    return emoji;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (article) {
        await api.updateArticle(article.id, { title, content, status });
      } else {
        await api.createArticle({ title, content, summary: content.slice(0, 100), status });
      }
      alert('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteStep === 1) {
      setConfirmDeleteStep(2);
      return;
    }
    if (article) {
      try {
        await api.deleteArticle(article.id);
        alert('删除成功！');
        window.history.back();
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
      }
    }
    setShowConfirmDelete(false);
    setConfirmDeleteStep(1);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateWordCount();
  };

  return (
    <div className={`editor-container pixel-theme ${fontFamily}`}>
      <div className="editor-header">
        <input
          type="text"
          className="editor-title pixel-input"
          placeholder="文章标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editor-controls">
          <select
            className="pixel-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="draft">📝 草稿</option>
            <option value="published">✅ 已发布</option>
            <option value="archived">📦 已归档</option>
          </select>
          <button
            className="pixel-btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '💾 保存中...' : '💾 保存'}
          </button>
          {article && (
            <button
              className="pixel-btn danger"
              onClick={() => setShowConfirmDelete(true)}
            >
              🗑️ 删除
            </button>
          )}
        </div>
      </div>

      <div className="editor-main">
        <div className="editor-toolbar">
          <div className="font-controls">
            <span className="toolbar-label">字体:</span>
            <select
              className="pixel-select small"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              {fontOptions.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))}>A-</button>
            <span className="font-size">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(32, fontSize + 2))}>A+</button>
          </div>
          
          <div className="pet-controls">
            <span className="toolbar-label">伙伴:</span>
            <select
              className="pixel-select small"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
            >
              {petOptions.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="editor-split">
          <div className="editor-content-area">
            <textarea
              ref={contentRef}
              className="editor-textarea pixel-textarea"
              placeholder="开始写作..."
              value={content}
              onChange={handleContentChange}
              style={{ 
                fontSize: `${fontSize}px`,
              }}
            />
          </div>

          <div className="editor-sidebar">
            <div className="word-stats pixel-card">
              <h3>📊 字数统计</h3>
              <div className="stat-item">
                <span className="stat-label">中文字数</span>
                <span className="stat-value pixel-value">{wordStats.chinese}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">英文词数</span>
                <span className="stat-value pixel-value">{wordStats.english}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总字数</span>
                <span className="stat-value pixel-value">{wordStats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">字符数</span>
                <span className="stat-value pixel-value">{wordStats.chars}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">阅读时间</span>
                <span className="stat-value pixel-value">{wordStats.readingTime} 分钟</span>
              </div>
            </div>

            <div className="growth-pet pixel-card">
              <h3>🌱 成长伙伴</h3>
              <div className="pet-display">
                <div 
                  className="pet-emoji"
                  style={{ fontSize: `${getPetSize() * 3}rem` }}
                >
                  {getPetEmoji()}
                </div>
                <div className="pet-progress">
                  <div 
                    className="progress-bar pixel-progress"
                    style={{ 
                      width: `${Math.min((wordStats.total / 5000) * 100, 100)}%` 
                    }}
                  />
                </div>
                <div className="pet-milestones">
                  <span className={wordStats.total >= 100 ? 'achieved' : ''}>100字</span>
                  <span className={wordStats.total >= 500 ? 'achieved' : ''}>500字</span>
                  <span className={wordStats.total >= 1000 ? 'achieved' : ''}>1000字</span>
                  <span className={wordStats.total >= 2000 ? 'achieved' : ''}>2000字</span>
                  <span className={wordStats.total >= 5000 ? 'achieved' : ''}>5000字</span>
                </div>
                <p className="pet-hint">
                  {wordStats.total < 100 ? '写更多字让它成长吧！' :
                   wordStats.total < 500 ? '不错的开始！' :
                   wordStats.total < 1000 ? '正在茁壮成长！' :
                   wordStats.total < 2000 ? '太棒了！' :
                   wordStats.total < 5000 ? '真是厉害！' : '🎉 恭喜大师！'}
                </p>
              </div>
            </div>

            <div className="quick-actions pixel-card">
              <h3>⚡ 快捷操作</h3>
              <button className="pixel-btn small">📋 大纲模式</button>
              <button className="pixel-btn small">🧠 思维导图</button>
              <button className="pixel-btn small">🎯 目标设定</button>
              <button className="pixel-btn small">📊 历史记录</button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content pixel-modal">
            <h2>⚠️ 确认删除</h2>
            {confirmDeleteStep === 1 ? (
              <>
                <p>确定要删除这篇文章吗？此操作不可撤销。</p>
                <div className="modal-actions">
                  <button
                    className="pixel-btn"
                    onClick={() => setShowConfirmDelete(false)}
                  >
                    取消
                  </button>
                  <button
                    className="pixel-btn danger"
                    onClick={() => setConfirmDeleteStep(2)}
                  >
                    继续删除
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>真的确定要删除吗？再次确认一下。</p>
                <div className="modal-actions">
                  <button
                    className="pixel-btn"
                    onClick={() => {
                      setShowConfirmDelete(false);
                      setConfirmDeleteStep(1);
                    }}
                  >
                    取消
                  </button>
                  <button
                    className="pixel-btn danger"
                    onClick={handleDelete}
                  >
                    ✅ 确认删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <DesktopPet 
        petType={selectedPet as any} 
        wordCount={wordStats.total} 
      />
    </div>
  );
};

export default Editor;
