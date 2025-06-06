// 
// ==================== DEPRECATED - NOT IN USE ====================
// This file has been replaced by RssApiService.ts
// The service is now exported from services/api/RssApiService.ts
// This file is kept for reference but should not be used
// ==================================================================
//
// import type { Feed, Article, Folder, AppSettings, SettingsUpdate } from '../types';

// const API_BASE = 'http://localhost:8000/api/v1'; // Adjust if backend runs elsewhere

// In a real application, these functions would make API calls to a backend.

// export const rssService = {
  /**
   * Fetches all feeds for the user.
   */
  getFeeds: async (): Promise<Feed[]> => {
    console.log('🔄 rssService.getFeeds called');
    const res = await fetch(`${API_BASE}/feeds/`);
    if (!res.ok) throw new Error('Failed to fetch feeds');
    const data = await res.json();
    console.log('📊 Raw feeds data from backend:', data);
    // Convert backend integer IDs to strings for frontend compatibility
    const result = data.map((feed: any) => ({
      ...feed,
      id: String(feed.id),
      folderId: feed.folder_id ? String(feed.folder_id) : null
    }));
    console.log('📊 Transformed feeds data:', result);
    return result;
  },

  /**
   * Adds a new feed by its URL.
   * The backend would typically parse the feed and return its details.
   */
  addFeed: async (url: string, feedName: string, folderId?: string | null): Promise<Feed> => {
    if (!url || !url.trim()) {
      throw new Error('Feed URL cannot be empty.');
    }
    if (!feedName || !feedName.trim()) {
      throw new Error('Feed name cannot be empty.');
    }
    const res = await fetch(`${API_BASE}/feeds/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title: feedName, folder_id: folderId })
    });
    if (!res.ok) throw new Error('Failed to add feed');
    const data = await res.json();
    // Convert backend integer IDs to strings for frontend compatibility
    return {
      ...data,
      id: String(data.id),
      folderId: data.folder_id ? String(data.folder_id) : null
    };
  },

  /**
   * Deletes a feed by its ID.
   */
  deleteFeed: async (feedId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/feeds/${feedId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete feed');
  },

  /**
   * Fetches articles for a specific feed.
   */
  getArticles: async (feedId: string): Promise<Article[]> => {
    const res = await fetch(`${API_BASE}/feeds/${feedId}/articles/`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    const data = await res.json();
    // Map backend snake_case to frontend camelCase
    return data.map((a: any) => ({
      id: a.id?.toString?.() ?? a.id,
      title: a.title,
      link: a.link,
      pubDate: a.pub_date, // map pub_date -> pubDate
      content: a.content,
      feedId: a.feed_id?.toString?.() ?? a.feed_id, // map feed_id -> feedId
      isRead: a.is_read ?? false,
      author: a.author,
      imageUrl: a.image_url,
      contentSnippet: a.content_snippet,
      feedTitle: a.feed_title,
    }));
  },

  /**
   * Marks an article as read.
   */
  markArticleAsRead: async (articleId: string): Promise<void> => {
    console.log(`rssService: Marking article ${articleId} as read (simulated)`);
    return Promise.resolve();
  },

  /**
   * Marks an article as unread.
   */
  markArticleAsUnread: async (articleId: string): Promise<void> => {
    console.log(`rssService: Marking article ${articleId} as unread (simulated)`);
    return Promise.resolve();
  },

  // Folder services
  getFolders: async (): Promise<Folder[]> => {
    console.log('🔄 rssService.getFolders called');
    const res = await fetch(`${API_BASE}/folders/`);
    if (!res.ok) throw new Error('Failed to fetch folders');
    const data = await res.json();
    console.log('📊 Raw folders data from backend:', data);
    // Convert backend integer/string IDs to strings for frontend compatibility
    const result = data.map((folder: any) => ({
      ...folder,
      id: String(folder.id)
    }));
    console.log('📊 Transformed folders data:', result);
    return result;
  },

  addFolder: async (name: string): Promise<Folder> => {
    if (!name || !name.trim()) {
      throw new Error('Folder name cannot be empty.');
    }
    const res = await fetch(`${API_BASE}/folders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw new Error('Failed to add folder');
    return res.json();
  },

  updateFolder: async (folderId: string, newName: string): Promise<Folder> => {
    if (!newName || !newName.trim()) {
      throw new Error('Folder name cannot be empty.');
    }
    const res = await fetch(`${API_BASE}/folders/${folderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    if (!res.ok) throw new Error('Failed to update folder');
    return res.json();
  },

  deleteFolder: async (folderId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/folders/${folderId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete folder');
  },

  moveFeedToFolder: async (feedId: string, folderId: string | null): Promise<Feed> => {
    console.log('🔄 rssService.moveFeedToFolder called with:', { feedId, folderId });
    const res = await fetch(`${API_BASE}/feeds/${feedId}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_folder_id: folderId })
    });
    if (!res.ok) throw new Error('Failed to move feed');
    const data = await res.json();
    console.log('📊 Raw move feed response from backend:', data);
    // Convert backend integer IDs to strings for frontend compatibility
    const result = {
      ...data,
      id: String(data.id),
      folderId: data.folder_id ? String(data.folder_id) : null
    };
    console.log('📊 Transformed move feed response:', result);
    return result;
  },

  /**
   * Utility: Fetch feed title from backend for a given URL
   */
  fetchFeedTitle: async (url: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/feeds/parse-title`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error('Failed to fetch feed title');
    const data = await res.json();
    return data.title || '';
  },

  /**
   * Delete articles older than specified number of days
   */
  cleanupOldArticles: async (days: number): Promise<string> => {
    const res = await fetch(`${API_BASE}/feeds/cleanup-articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days })
    });
    if (!res.ok) throw new Error('Failed to cleanup old articles');
    const data = await res.json();
    return data.detail || '';
  },

  // Settings management
  getSettings: async (): Promise<AppSettings> => {
    const response = await fetch(`${API_BASE}/settings/`);

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    return response.json();
  },

  updateSettings: async (settings: SettingsUpdate): Promise<AppSettings> => {
    const response = await fetch(`${API_BASE}/settings/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update settings');
    }

    return response.json();
  },
};
