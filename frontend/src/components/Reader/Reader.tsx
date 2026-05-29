import { useState, useEffect } from 'react';

interface ReaderProps {
  content?: string;
  fileName?: string;
  fileType?: string;
  onClose?: () => void;
  file?: any;
}

export default function Reader({ content = '', fileName = '', fileType = 'txt', onClose, file }: ReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');

  useEffect(() => {
    // 将内容分页
    const linesPerPage = 30;
    const lines = content.split('\n');
    const pageArray: string[] = [];
    
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pageArray.push(lines.slice(i, i + linesPerPage).join('\n'));
    }
    
    setPages(pageArray);
  }, [content]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'ArrowRight') nextPage();
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'theme-dark';
      case 'sepia':
        return 'theme-sepia';
      default:
        return 'theme-light';
    }
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'sepia')[] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  return (
    <div className={`reader-container ${getThemeClass()}`} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="reader-header">
        <button onClick={onClose} className="btn btn-secondary">
          ← 关闭
        </button>
        <h2>{fileName}</h2>
        <div className="reader-controls">
          <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="btn btn-outline">
            A-
          </button>
          <span className="font-size">{fontSize}px</span>
          <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="btn btn-outline">
            A+
          </button>
          <button onClick={toggleTheme} className="btn btn-outline">
            🌓
          </button>
        </div>
      </div>

      <div className="reader-content">
        <div className="page-controls">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="page-btn"
          >
            ◀
          </button>
          <span className="page-info">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="page-btn"
          >
            ▶
          </button>
        </div>

        <div className="page-content">
          {pages[currentPage] && (
            <pre className="text-content">{pages[currentPage]}</pre>
          )}
        </div>

        <div className="page-controls">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="page-btn"
          >
            ◀ 上一页
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="page-btn"
          >
            下一页 ▶
          </button>
        </div>
      </div>

      <div className="reader-footer">
        <p>提示：使用左右方向键翻页</p>
      </div>
    </div>
  );
}
