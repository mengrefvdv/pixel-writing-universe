from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import random
import string
import requests

app = Flask(__name__)
CORS(app)

# 配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
USER_DATA_DIR = os.path.expanduser('~/.pixel-writer')
os.makedirs(USER_DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(USER_DATA_DIR, 'writing.db')
ALLOWED_EXTENSIONS = {'txt', 'md', 'epub', 'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # 用户表
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL,
                  token TEXT,
                  theme TEXT DEFAULT 'light',
                  wallpaper TEXT DEFAULT 'bamboo',
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # 文章表
    c.execute('''CREATE TABLE IF NOT EXISTS articles
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  title TEXT NOT NULL,
                  content TEXT NOT NULL,
                  summary TEXT,
                  status TEXT DEFAULT 'draft',
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id))''')
    
    # 文件表
    c.execute('''CREATE TABLE IF NOT EXISTS files
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  filename TEXT NOT NULL,
                  original_name TEXT NOT NULL,
                  file_path TEXT NOT NULL,
                  file_type TEXT NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id))''')
    
    # 写作记录表
    c.execute('''CREATE TABLE IF NOT EXISTS writing_sessions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  duration INTEGER DEFAULT 0,
                  word_count INTEGER DEFAULT 0,
                  date DATE NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id))''')
    
    # 书籍表
    c.execute('''CREATE TABLE IF NOT EXISTS books
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  title TEXT NOT NULL,
                  author TEXT,
                  description TEXT,
                  cover_url TEXT,
                  status TEXT DEFAULT 'planning',
                  word_goal INTEGER DEFAULT 0,
                  current_words INTEGER DEFAULT 0,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id))''')
    
    conn.commit()
    conn.close()

init_db()

# 工具函数
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    return str(uuid.uuid4())

def get_user_from_token(token):
    if not token:
        return None
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, username, email, theme, wallpaper FROM users WHERE token = ?', (token,))
    user = c.fetchone()
    conn.close()
    return dict(user) if user else None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 智能起名器
def generate_unique_name(prefix="作品", existing_names=None):
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    number = random.randint(100, 999)
    return f"{prefix}_{number}_{suffix}"

# ========== 用户认证 ==========

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'error': '缺少必要字段'})
    
    username = data['username']
    email = data['email']
    password = hash_password(data['password'])
    
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                  (username, email, password))
        conn.commit()
        user_id = c.lastrowid
        conn.close()
        return jsonify({'success': True, 'user_id': user_id})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'error': '用户名或邮箱已存在'})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'error': '缺少必要字段'})
    
    email = data['email']
    password = hash_password(data['password'])
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, username, email, theme, wallpaper FROM users WHERE email = ? AND password = ?', (email, password))
    user = c.fetchone()
    
    if user:
        token = generate_token()
        c.execute('UPDATE users SET token = ? WHERE id = ?', (token, user['id']))
        conn.commit()
        conn.close()
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'theme': user['theme'],
                'wallpaper': user['wallpaper']
            }
        })
    
    conn.close()
    return jsonify({'success': False, 'error': '邮箱或密码错误'})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    token = request.headers.get('Authorization')
    if token:
        conn = get_db()
        c = conn.cursor()
        c.execute('UPDATE users SET token = NULL WHERE token = ?', (token,))
        conn.commit()
        conn.close()
    return jsonify({'success': True})

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if user:
        return jsonify({'success': True, 'user': user})
    return jsonify({'success': False, 'error': '未登录'})

@app.route('/api/auth/settings', methods=['PUT'])
def update_settings():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    conn = get_db()
    c = conn.cursor()
    
    if 'theme' in data:
        c.execute('UPDATE users SET theme = ? WHERE id = ?', (data['theme'], user['id']))
    if 'wallpaper' in data:
        c.execute('UPDATE users SET wallpaper = ? WHERE id = ?', (data['wallpaper'], user['id']))
    
    conn.commit()
    conn.close()
    return jsonify({'success': True})

# ========== 文章管理 ==========

@app.route('/api/articles', methods=['POST'])
def create_article():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'success': False, 'error': '缺少必要字段'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO articles (user_id, title, content, summary, status)
                 VALUES (?, ?, ?, ?, ?)''',
              (user['id'], data['title'], data['content'], 
               data.get('summary', ''), data.get('status', 'draft')))
    conn.commit()
    article_id = c.lastrowid
    conn.close()
    
    return jsonify({'success': True, 'article_id': article_id})

@app.route('/api/articles', methods=['GET'])
def get_articles():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    status = request.args.get('status', 'all')
    
    conn = get_db()
    c = conn.cursor()
    
    if status == 'all':
        c.execute('SELECT * FROM articles WHERE user_id = ? ORDER BY updated_at DESC', (user['id'],))
    else:
        c.execute('SELECT * FROM articles WHERE user_id = ? AND status = ? ORDER BY updated_at DESC', 
                  (user['id'], status))
    
    articles = []
    for row in c.fetchall():
        articles.append({
            'id': row['id'],
            'title': row['title'],
            'content': row['content'],
            'summary': row['summary'],
            'status': row['status'],
            'created_at': row['created_at'],
            'updated_at': row['updated_at']
        })
    
    conn.close()
    return jsonify({'success': True, 'data': articles})

@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM articles WHERE id = ? AND user_id = ?', (article_id, user['id']))
    row = c.fetchone()
    conn.close()
    
    if row:
        return jsonify({
            'success': True,
            'data': {
                'id': row['id'],
                'title': row['title'],
                'content': row['content'],
                'summary': row['summary'],
                'status': row['status'],
                'created_at': row['created_at'],
                'updated_at': row['updated_at']
            }
        })
    
    return jsonify({'success': False, 'error': '文章不存在'})

@app.route('/api/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': '缺少数据'})
    
    conn = get_db()
    c = conn.cursor()
    
    update_fields = []
    params = []
    
    if 'title' in data:
        update_fields.append('title = ?')
        params.append(data['title'])
    if 'content' in data:
        update_fields.append('content = ?')
        params.append(data['content'])
    if 'summary' in data:
        update_fields.append('summary = ?')
        params.append(data['summary'])
    if 'status' in data:
        update_fields.append('status = ?')
        params.append(data['status'])
    
    update_fields.append('updated_at = CURRENT_TIMESTAMP')
    params.append(article_id)
    params.append(user['id'])
    
    c.execute(f'UPDATE articles SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?', tuple(params))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM articles WHERE id = ? AND user_id = ?', (article_id, user['id']))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ========== 书籍管理 ==========

@app.route('/api/books', methods=['POST'])
def create_book():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'success': False, 'error': '缺少必要字段'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO books (user_id, title, author, description, cover_url, status, word_goal, current_words)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
              (user['id'], data['title'], data.get('author', ''), data.get('description', ''),
               data.get('cover_url', ''), data.get('status', 'planning'),
               data.get('word_goal', 0), data.get('current_words', 0)))
    conn.commit()
    book_id = c.lastrowid
    conn.close()
    
    return jsonify({'success': True, 'book_id': book_id})

@app.route('/api/books', methods=['GET'])
def get_books():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC', (user['id'],))
    
    books = []
    for row in c.fetchall():
        books.append({
            'id': row['id'],
            'title': row['title'],
            'author': row['author'],
            'description': row['description'],
            'cover_url': row['cover_url'],
            'status': row['status'],
            'word_goal': row['word_goal'],
            'current_words': row['current_words'],
            'created_at': row['created_at']
        })
    
    conn.close()
    return jsonify({'success': True, 'data': books})

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    conn = get_db()
    c = conn.cursor()
    
    update_fields = []
    params = []
    
    for field in ['title', 'author', 'description', 'cover_url', 'status', 'word_goal', 'current_words']:
        if field in data:
            update_fields.append(f'{field} = ?')
            params.append(data[field])
    
    params.append(book_id)
    params.append(user['id'])
    
    if update_fields:
        c.execute(f'UPDATE books SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?', tuple(params))
        conn.commit()
    
    conn.close()
    return jsonify({'success': True})

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM books WHERE id = ? AND user_id = ?', (book_id, user['id']))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ========== 写作记录 ==========

@app.route('/api/sessions', methods=['POST'])
def add_session():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    today = datetime.now().strftime('%Y-%m-%d')
    
    conn = get_db()
    c = conn.cursor()
    
    c.execute('SELECT * FROM writing_sessions WHERE user_id = ? AND date = ?', (user['id'], today))
    existing = c.fetchone()
    
    if existing:
        c.execute('''UPDATE writing_sessions 
                     SET duration = duration + ?, word_count = word_count + ?
                     WHERE id = ?''',
                  (data.get('duration', 0), data.get('word_count', 0), existing['id']))
    else:
        c.execute('''INSERT INTO writing_sessions (user_id, duration, word_count, date)
                     VALUES (?, ?, ?, ?)''',
                  (user['id'], data.get('duration', 0), data.get('word_count', 0), today))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    days = int(request.args.get('days', 7))
    conn = get_db()
    c = conn.cursor()
    c.execute('''SELECT * FROM writing_sessions 
                 WHERE user_id = ? 
                 ORDER BY date DESC 
                 LIMIT ?''', (user['id'], days))
    
    sessions = []
    for row in c.fetchall():
        sessions.append({
            'id': row['id'],
            'duration': row['duration'],
            'word_count': row['word_count'],
            'date': row['date'],
            'created_at': row['created_at']
        })
    
    conn.close()
    return jsonify({'success': True, 'data': sessions})

# ========== 文件管理 ==========

@app.route('/api/files', methods=['POST'])
def upload_file():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': '没有选择文件'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': '文件名不能为空'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{user['id']}_{datetime.now().timestamp()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        conn = get_db()
        c = conn.cursor()
        file_type = filename.rsplit('.', 1)[1].lower()
        c.execute('INSERT INTO files (user_id, filename, original_name, file_path, file_type) VALUES (?, ?, ?, ?, ?)',
                  (user['id'], unique_filename, filename, file_path, file_type))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': '上传成功'})
    
    return jsonify({'success': False, 'error': '不支持的文件类型'})

@app.route('/api/files', methods=['GET'])
def get_files():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, filename, original_name, file_type, created_at FROM files WHERE user_id = ? ORDER BY created_at DESC', (user['id'],))
    
    files = []
    for row in c.fetchall():
        files.append({
            'id': row['id'],
            'filename': row['filename'],
            'original_name': row['original_name'],
            'file_type': row['file_type'],
            'created_at': row['created_at']
        })
    
    conn.close()
    return jsonify({'success': True, 'data': files})

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT file_path FROM files WHERE id = ? AND user_id = ?', (file_id, user['id']))
    row = c.fetchone()
    
    if row:
        file_path = row['file_path']
        if os.path.exists(file_path):
            os.remove(file_path)
        c.execute('DELETE FROM files WHERE id = ?', (file_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    
    conn.close()
    return jsonify({'success': False, 'error': '文件不存在'})

@app.route('/api/files/<int:file_id>/content', methods=['GET'])
def get_file_content(file_id):
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT file_path, file_type FROM files WHERE id = ? AND user_id = ?', (file_id, user['id']))
    row = c.fetchone()
    conn.close()
    
    if row:
        file_path, file_type = row
        if file_type in ['txt', 'md']:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return jsonify({'success': True, 'content': content, 'file_type': file_type})
            except Exception as e:
                return jsonify({'success': False, 'error': '读取文件失败'})
    
    return jsonify({'success': False, 'error': '文件不存在或不支持预览'})

# ========== 智能起名器 ==========

@app.route('/api/generator/name', methods=['POST'])
def generate_name():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    prefix = data.get('prefix', '作品')
    
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT title FROM books WHERE user_id = ?', (user['id'],))
    existing = [row['title'] for row in c.fetchall()]
    conn.close()
    
    name = generate_unique_name(prefix)
    while name in existing:
        name = generate_unique_name(prefix)
    
    return jsonify({'success': True, 'name': name})

# ========== GitHub搜索 ==========

@app.route('/api/github/search', methods=['GET'])
def search_github():
    query = request.args.get('q', 'writing app')
    try:
        response = requests.get(
            'https://api.github.com/search/repositories',
            params={'q': query, 'sort': 'stars', 'order': 'desc', 'per_page': 20},
            timeout=10
        )
        data = response.json()
        
        repos = []
        for item in data.get('items', []):
            repos.append({
                'id': item['id'],
                'name': item['name'],
                'full_name': item['full_name'],
                'description': item['description'],
                'stars': item['stargazers_count'],
                'forks': item['forks_count'],
                'language': item['language'],
                'url': item['html_url'],
                'updated_at': item['updated_at']
            })
        
        return jsonify({'success': True, 'data': repos})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ========== 外部API代理 ==========

@app.route('/api/external/chat', methods=['POST'])
def chat_with_external():
    token = request.headers.get('Authorization')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'success': False, 'error': '未登录'})
    
    data = request.json
    provider = data.get('provider', 'generic')
    message = data.get('message', '')
    
    if provider == 'merlin':
        response_text = f"[Merlin回复] 针对您的问题: '{message}'，这里是一些建议..."
    elif provider == 'chatgpt':
        response_text = f"[ChatGPT回复] 让我帮您分析: {message}"
    else:
        response_text = f"收到您的消息: {message}"
    
    return jsonify({'success': True, 'response': response_text})

if __name__ == '__main__':
    app.run(debug=True, port=5005)
