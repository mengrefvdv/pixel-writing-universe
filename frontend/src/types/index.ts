export interface User {
  id: number;
  username: string;
  email: string;
  theme?: string;
  wallpaper?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  user?: User;
}

export interface ArticleResponse {
  success: boolean;
  error?: string;
  data?: Article | Article[];
  article_id?: number;
}

export interface Book {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  cover_url?: string;
  status?: 'planning' | 'writing' | 'completed';
  word_goal?: number;
  current_words?: number;
  created_at?: string;
}
