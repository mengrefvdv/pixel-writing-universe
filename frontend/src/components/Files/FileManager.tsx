import { useState, useRef } from 'react';

interface FileItem {
  id: number;
  filename: string;
  original_name: string;
  file_type: string;
  created_at: string;
}

interface FileManagerProps {
  files?: FileItem[];
  onOpenFile?: (fileId: number) => void;
  onRead?: (file: FileItem) => void;
  onDeleteFile?: (fileId: number) => void;
  onUpload?: (file: File) => void;
}

export default function FileManager({ files = [], onOpenFile, onRead, onDeleteFile, onUpload }: FileManagerProps) {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['txt', 'md', 'epub', 'pdf', 'docx'];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext && validTypes.includes(ext) && onUpload) {
        onUpload(file);
        setError('');
      } else {
        setError('不支持的文件类型');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'txt':
        return '📝';
      case 'md':
        return '📄';
      case 'epub':
        return '📚';
      case 'pdf':
        return '📕';
      case 'docx':
        return '📘';
      default:
        return '📁';
    }
  };

  return (
    <div className="file-manager">
      <div className="manager-header">
        <h2>我的文件</h2>
        <label className="upload-btn">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <button className="btn btn-primary">📤 上传文件</button>
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>还没有上传文件</p>
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary">
            上传文件
          </button>
        </div>
      ) : (
        <div className="file-grid">
          {files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-icon">{getFileIcon(file.file_type)}</div>
              <h4 className="file-name">{file.original_name}</h4>
              <p className="file-date">{formatDate(file.created_at)}</p>
              <div className="file-actions">
                {file.file_type === 'txt' || file.file_type === 'md' ? (
                  <button onClick={() => {
                    if (onRead) onRead(file);
                    else if (onOpenFile) onOpenFile(file.id);
                  }} className="btn btn-outline">
                    阅读
                  </button>
                ) : null}
                <button
                  onClick={() => {
                      if (confirm('确定要删除这个文件吗？') && onDeleteFile) {
                        onDeleteFile(file.id);
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
