import { BaseApiService } from "./BaseApiService";
import type {
  Feed,
  Article,
  Folder,
  AppSettings,
  SettingsUpdate,
} from "../../types";

/**
 * RSS Service that extends BaseApiService
 * Provides RSS-specific API methods with consistent error handling and data transformation
 */
class RssApiService extends BaseApiService {
  constructor() {
    super("http://localhost:8000/api/v1");
  }

  /**
   * Transform backend response to frontend format
   * Converts integer IDs to strings and snake_case to camelCase
   */
  protected transformResponse<T>(data: any): T {
    if (Array.isArray(data)) {
      return data.map(item => this.transformItem(item)) as T;
    }
    return this.transformItem(data) as T;
  }

  private transformItem(item: any): any {
    if (!item || typeof item !== "object") {
      return item;
    }

    const transformed = { ...item };

    // Convert IDs to strings
    if (transformed.id !== undefined) {
      transformed.id = String(transformed.id);
    }

    // Convert folder_id to folderId and make it a string
    if (transformed.folder_id !== undefined) {
      transformed.folderId = transformed.folder_id
        ? String(transformed.folder_id)
        : null;
      delete transformed.folder_id;
    }

    // Convert feed_id to feedId and make it a string
    if (transformed.feed_id !== undefined) {
      transformed.feedId = String(transformed.feed_id);
      delete transformed.feed_id;
    }

    // Convert image_url to imageUrl for articles
    if (transformed.image_url !== undefined) {
      transformed.imageUrl = transformed.image_url;
      delete transformed.image_url;
    }

    // Convert published_at to pubDate for articles
    if (transformed.published_at !== undefined) {
      transformed.pubDate = transformed.published_at;
      delete transformed.published_at;
    }

    return transformed;
  }
  /**
   * Fetches all feeds for the user
   */
  async getFeeds(): Promise<Feed[]> {
    // Removed debug logging for production
    const data = await this.get<any[]>("/feeds/");
    return this.transformResponse<Feed[]>(data);
  }
  /**
   * Adds a new feed by its URL
   */
  async addFeed(
    url: string,
    feedName: string,
    folderId?: string | null
  ): Promise<Feed> {
    if (!url?.trim()) {
      throw new Error("Feed URL cannot be empty.");
    }
    if (!feedName?.trim()) {
      throw new Error("Feed name cannot be empty.");
    }
    try {
      const data = await this.post<any>("/feeds/", {
        url,
        title: feedName,
        folder_id: folderId,
      });
      return this.transformResponse<Feed>(data);
    } catch (err: any) {
      // If backend returns a 400 error, try to parse and throw a user-friendly message
      if (err instanceof Error && (err as any).status === 400) {
        let msg = "This feed source already exists!!.";
        if (err.message) {
          try {
            const parsed =
              typeof err.message === "string"
                ? JSON.parse(err.message)
                : err.message;
            if (
              (parsed && parsed.existingFeed) ||
              (parsed && parsed.detail && parsed.detail.existingFeed)
            ) {
              msg = "This feed source already exists!!.";
            } else if (
              parsed &&
              parsed.detail &&
              typeof parsed.detail === "string" &&
              parsed.detail.toLowerCase().includes("already exists")
            ) {
              msg = "This feed source already exists!!.";
            } else if (
              typeof parsed === "string" &&
              parsed.toLowerCase().includes("already exists")
            ) {
              msg = "This feed source already exists!!.";
            }
          } catch {
            if (err.message.toLowerCase().includes("already exists")) {
              msg = "This feed source already exists!!.";
            }
          }
        }
        throw new Error(msg);
      }
      throw err;
    }
  }

  /**
   * Deletes a feed by its ID
   */
  async deleteFeed(feedId: string): Promise<void> {
    return this.delete<void>(`/feeds/${feedId}`);
  }
  /**
   * Updates a feed's folder
   */
  async moveFeedToFolder(
    feedId: string,
    folderId: string | null
  ): Promise<Feed> {
    console.log("🔄 RssApiService.moveFeedToFolder called with:", {
      feedId,
      folderId,
    });
    // Use PATCH to /feeds/{feedId}/move to match backend
    const data = await this.patch<any>(`/feeds/${feedId}/move`, {
      target_folder_id: folderId,
    });
    console.log("📊 Raw move feed response from backend:", data);
    const transformed = this.transformResponse<Feed>(data);
    console.log("📊 Transformed move feed response:", transformed);
    return transformed;
  }
  /**
   * Fetches articles for a specific feed
   */
  async getArticles(feedId: string): Promise<Article[]> {
    const data = await this.get<any[]>(`/feeds/${feedId}/articles/`); // Use trailing slash to avoid 307 redirect
    return this.transformResponse<Article[]>(data);
  }

  /**
   * Marks an article as read
   */
  async markArticleAsRead(articleId: string): Promise<void> {
    return this.put<void>(`/articles/${articleId}/read`, {});
  } /**
   * Fetches all folders for the user
   */
  async getFolders(): Promise<Folder[]> {
    const data = await this.get<any[]>("/folders/");
    return this.transformResponse<Folder[]>(data);
  }
  /**
   * Adds a new folder
   */
  async addFolder(name: string): Promise<Folder> {
    if (!name?.trim()) {
      throw new Error("Folder name cannot be empty.");
    }

    const data = await this.post<any>("/folders/", { name });
    return this.transformResponse<Folder>(data);
  }
  /**
   * Renames a folder
   */
  async renameFolder(folderId: string, newName: string): Promise<Folder> {
    if (!newName?.trim()) {
      throw new Error("Folder name cannot be empty.");
    }

    const data = await this.put<any>(`/folders/${folderId}`, { name: newName });
    return this.transformResponse<Folder>(data);
  }

  /**
   * Deletes a folder
   */
  async deleteFolder(folderId: string): Promise<void> {
    return this.delete<void>(`/folders/${folderId}`);
  }
  /**
   * Fetches application settings
   */
  async getSettings(): Promise<AppSettings> {
    const data = await this.get<any>("/settings/");
    return this.transformResponse<AppSettings>(data);
  }

  /**
   * Updates application settings
   */
  async updateSettings(settings: SettingsUpdate): Promise<AppSettings> {
    const data = await this.put<any>("/settings/", settings);
    return this.transformResponse<AppSettings>(data);
  }

  /**
   * Cleans up old articles
   */
  async cleanupOldArticles(
    daysToKeep: number
  ): Promise<{ deleted_count: number }> {
    if (daysToKeep < 1) {
      throw new Error("Days to keep must be at least 1.");
    }

    return this.post<{ deleted_count: number }>("/articles/cleanup", {
      days_to_keep: daysToKeep,
    });
  }

  /**
   * Utility: Fetch feed title from backend for a given URL
   */
  async fetchFeedTitle(url: string): Promise<string> {
    if (!url?.trim()) {
      throw new Error("Feed URL cannot be empty.");
    }

    const data = await this.post<{ title: string }>("/feeds/parse-title", {
      url,
    });
    return data.title || "";
  }
}

// Export a singleton instance
export const rssApiService = new RssApiService();
