import type { Feed, Article, Folder } from '../types';

const API_BASE = 'http://localhost:8000/api/v1'; // Adjust if backend runs elsewhere

// In a real application, these functions would make API calls to a backend.

export const rssService = {
  /**
   * Fetches all feeds for the user.
   */
  getFeeds: async (): Promise<Feed[]> => {
    const res = await fetch(`${API_BASE}/feeds/`);
    if (!res.ok) throw new Error('Failed to fetch feeds');
    return res.json();
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
    return res.json();
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
    const res = await fetch(`${API_BASE}/folders/`);
    if (!res.ok) throw new Error('Failed to fetch folders');
    return res.json();
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
    const res = await fetch(`${API_BASE}/feeds/${feedId}/move`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_folder_id: folderId })
    });
    if (!res.ok) throw new Error('Failed to move feed');
    return res.json();
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
};
