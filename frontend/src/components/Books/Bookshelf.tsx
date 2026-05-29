import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Book } from '../../types';
import './Bookshelf.css';

const Bookshelf: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    status: 'planning' as const,
    word_goal: 0,
    current_words: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (error) {
      console.error('加载书籍失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBook(newBook);
      setShowAddModal(false);
      setNewBook({
        title: '',
        author: '',
        description: '',
        status: 'planning',
        word_goal: 0,
        current_words: 0,
      });
      loadBooks();
    } catch (error) {
      console.error('添加书籍失败:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (confirm('确定要删除这本书吗？')) {
      try {
        await api.deleteBook(id);
        loadBooks();
      } catch (error) {
        console.error('删除书籍失败:', error);
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      planning: '📋 策划中',
      writing: '✍️ 写作中',
      completed: '✅ 已完成',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planning: '#f39c12',
      writing: '#3498db',
      completed: '#27ae60',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">📚</div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="bookshelf-container">
      <div className="bookshelf-header">
        <h1>📚 我的书架</h1>
        <button className="add-book-btn" onClick={() => setShowAddModal(true)}>
          ➕ 添加书籍
        </button>
      </div>

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h3>书架空空如也</h3>
            <p>点击上方按钮添加你的第一本书吧！</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} />
                ) : (
                  <div className="placeholder-cover">
                    <span className="book-emoji">📕</span>
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                {book.author && <p className="book-author">by {book.author}</p>}
                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}
                <div 
                  className="book-status"
                  style={{ color: getStatusColor(book.status) }}
                >
                  {getStatusLabel(book.status)}
                </div>
                {book.word_goal > 0 && (
                  <div className="word-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min((book.current_words / book.word_goal) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <p className="progress-text">
                      {book.current_words.toLocaleString()} / {book.word_goal.toLocaleString()} 字
                    </p>
                  </div>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  🗑️ 删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>➕ 添加新书</h2>
            <form onSubmit={handleAddBook}>
              <div className="form-group">
                <label>书名 *</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                  placeholder="输入书名"
                />
              </div>
              <div className="form-group">
                <label>作者</label>
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="作者名字"
                />
              </div>
              <div className="form-group">
                <label>简介</label>
                <textarea
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="书籍简介..."
                />
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={newBook.status}
                  onChange={(e) => setNewBook({ ...newBook, status: e.target.value as any })}
                >
                  <option value="planning">📋 策划中</option>
                  <option value="writing">✍️ 写作中</option>
                  <option value="completed">✅ 已完成</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>目标字数</label>
                  <input
                    type="number"
                    value={newBook.word_goal}
                    onChange={(e) => setNewBook({ ...newBook, word_goal: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>当前字数</label>
                  <input
                    type="number"
                    value={newBook.current_words}
                    onChange={(e) => setNewBook({ ...newBook, current_words: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
