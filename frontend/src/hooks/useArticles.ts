import { useState, useCallback } from 'react';
import { Article } from '../types';
import { api } from '../services/api';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchArticles = useCallback(async (status?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getArticles(status);
      setArticles(data || []);
    } catch (err) {
      setError('获取文章失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const createArticle = useCallback(async (title: string, content: string, summary?: string) => {
    try {
      await api.createArticle({ title, content, summary, status: 'draft' });
      await fetchArticles();
      return { success: true };
    } catch {
      return { success: false, error: '创建失败' };
    }
  }, [fetchArticles]);

  const updateArticle = useCallback(async (id: number, data: Partial<Article>) => {
    try {
      await api.updateArticle(id, data);
      await fetchArticles();
      return { success: true };
    } catch {
      return { success: false, error: '更新失败' };
    }
  }, [fetchArticles]);

  const deleteArticle = useCallback(async (id: number) => {
    try {
      await api.deleteArticle(id);
      await fetchArticles();
      return { success: true };
    } catch {
      return { success: false, error: '删除失败' };
    }
  }, [fetchArticles]);

  const getArticle = useCallback(async (id: number): Promise<Article | null> => {
    try {
      return await api.getArticle(id);
    } catch {
      console.error('获取文章失败');
    }
    return null;
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticle,
  };
}
