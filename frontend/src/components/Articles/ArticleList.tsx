import { Article } from '../../types';

interface ArticleListProps {
  articles?: Article[];
  loading?: boolean;
  onEdit?: (article: Article) => void;
  onDelete?: (id: number) => void;
  onNew?: () => void;
}

export default function ArticleList({ articles = [], loading = false, onEdit, onDelete, onNew }: ArticleListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="badge badge-draft">草稿</span>;
      case 'published':
        return <span className="badge badge-published">已发布</span>;
      case 'archived':
        return <span className="badge badge-archived">已归档</span>;
      default:
        return null;
    }
  };

  return (
    <div className="article-list-container">
      <div className="list-header">
        <h2>我的文章</h2>
        <button onClick={() => onNew?.()} className="btn btn-primary">
          ✍️ 写文章
        </button>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>还没有文章</p>
          <button onClick={onNew} className="btn btn-primary">
            开始写作
          </button>
        </div>
      ) : (
        <div className="article-list">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-info">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">
                  {article.summary || article.content.substring(0, 100)}...
                </p>
                <div className="article-meta">
                  {getStatusBadge(article.status)}
                  <span className="article-date">{formatDate(article.updated_at)}</span>
                </div>
              </div>
              <div className="article-actions">
                <button onClick={() => onEdit?.(article)} className="btn btn-outline">
                  编辑
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要删除这篇文章吗？')) {
                      onDelete?.(article.id);
                    }
                  }}
                  className="btn btn-danger"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
