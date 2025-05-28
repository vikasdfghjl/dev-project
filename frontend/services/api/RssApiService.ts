import { BaseApiService } from './BaseApiService';
import { Feed, Article, Folder } from '../../types/entities';

export class RssApiService extends BaseApiService {
  constructor() {
    super(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');
  }

  async getFeeds(): Promise<Feed[]> {
    const data = await this.get<Feed[]>('/feeds/');
    return data.map(this.transformFeed);
  }

  async getFeed(id: string): Promise<Feed> {
    const data = await this.get<Feed>(`/feeds/${id}/`);
    return this.transformFeed(data);
  }

  async parseFeedTitle(url: string): Promise<string> {
    const response = await this.post<{ title: string }>('/feeds/parse-title', { url });
    return response.title;
  }

  async addFeed(url: string, name: string, folderId?: string): Promise<Feed> {
    const data = await this.post<Feed>('/feeds/', { 
      url, 
      title: name,
      folder_id: folderId 
    });
    return this.transformFeed(data);
  }

  async updateFeed(id: string, data: Partial<Feed>): Promise<Feed> {
    const response = await this.put<Feed>(`/feeds/${id}/`, data);
    return this.transformFeed(response);
  }

  async deleteFeed(id: string): Promise<void> {
    await this.delete(`/feeds/${id}/`);
  }

  async moveFeedToFolder(feedId: string, folderId: string | null): Promise<Feed> {
    const response = await this.put<Feed>(`/feeds/${feedId}/move`, { target_folder_id: folderId });
    return this.transformFeed(response);
  }

  async getArticles(feedId?: string): Promise<Article[]> {
    const endpoint = feedId ? `/feeds/${feedId}/articles/` : '/articles/';
    return this.get<Article[]>(endpoint);
  }

  async getArticle(id: string): Promise<Article> {
    return this.get<Article>(`/articles/${id}/`);
  }

  async getFolders(): Promise<Folder[]> {
    return this.get<Folder[]>('/folders/');
  }

  async getFolder(id: string): Promise<Folder> {
    return this.get<Folder>(`/folders/${id}/`);
  }

  async addFolder(name: string): Promise<Folder> {
    return this.post<Folder>('/folders/', { name });
  }

  async updateFolder(id: string, name: string): Promise<Folder> {
    return this.put<Folder>(`/folders/${id}/`, { name });
  }

  async deleteFolder(id: string): Promise<void> {
    await this.delete(`/folders/${id}/`);
  }

  private transformFeed = (feed: any): Feed => ({
    ...feed,
    id: String(feed.id),
    folderId: feed.folder_id ? String(feed.folder_id) : null,
  });
}

export const rssApiService = new RssApiService();
