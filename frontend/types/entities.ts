// Core domain entities and enums

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string; // ISO date string
  contentSnippet?: string;
  content?: string; // Full HTML content
  feedId: string;
  feedTitle?: string; // For convenience
  isRead?: boolean;
  author?: string;
  imageUrl?: string; // Optional image URL for the article
}

export interface Feed {
  id: string;
  title: string;
  url: string; // The RSS feed URL itself
  description?: string;
  link?: string; // Link to the website
  lastFetched?: string; // ISO date string
  favicon?: string; // URL to favicon
  category?: string; // Optional category for organizing feeds
  folderId?: string | null; // ID of the folder this feed belongs to
}

export interface Folder {
  id: string;
  name: string;
}

export type ArticleSortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc";

export type ArticleFilterOption = "all" | "unread" | "read";

export type ArticleViewStyle = "list" | "card";
