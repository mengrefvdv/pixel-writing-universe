import { Article } from '../types';

const API_BASE = 'http://localhost:5005/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Book {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  cover_url?: string;
  status?: 'planning' | 'writing' | 'completed';
  word_goal?: number;
  current_words?: number;
}

interface Session {
  duration: number;
  word_count: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: { [key: string]: string } = {};
    if (options.headers) {
      Object.entries(options.headers as Record<string, string>).forEach(([k, v]) => {
        headers[k] = String(v);
      });
    }

    if (this.token) {
      headers['Authorization'] = this.token;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || '请求失败');
    }
    return data;
  }

  async register(username: string, email: string, password: string) {
    return this.request<{ user_id: number }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateSettings(settings: { theme?: string; wallpaper?: string }) {
    return this.request('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getArticles(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<{ data: Article[] }>(`/articles${query}`).then(r => r.data);
  }

  async getArticle(id: number) {
    return this.request<{ data: Article }>(`/articles/${id}`).then(r => r.data);
  }

  async createArticle(article: Article) {
    return this.request<{ article_id: number }>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: number, article: Partial<Article>) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: number) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  async getBooks() {
    return this.request<{ data: Book[] }>('/books').then(r => r.data);
  }

  async createBook(book: Book) {
    return this.request<{ book_id: number }>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: number, book: Partial<Book>) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: number) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  async getSessions(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<{ data: any[] }>(`/sessions${query}`).then(r => r.data);
  }

  async addSession(session: Session) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async getFiles() {
    return this.request<{ data: any[] }>('/files').then(r => r.data);
  }

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/files', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteFile(id: number) {
    return this.request(`/files/${id}`, {
      method: 'DELETE',
    });
  }

  async getFileContent(id: number) {
    return this.request<{ content: string; file_type: string }>(`/files/${id}/content`);
  }

  async generateName(prefix?: string) {
    return this.request<{ name: string }>('/generator/name', {
      method: 'POST',
      body: JSON.stringify({ prefix }),
    });
  }

  async searchGitHub(query: string) {
    return this.request<{ data: any[] }>(`/github/search?q=${encodeURIComponent(query)}`).then(r => r.data);
  }

  async chatWithExternal(provider: string, message: string) {
    return this.request<{ response: string }>('/external/chat', {
      method: 'POST',
      body: JSON.stringify({ provider, message }),
    });
  }
}

export const api = new ApiService();
