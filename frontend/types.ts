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
  | 'date-desc' 
  | 'date-asc' 
  | 'title-asc' 
  | 'title-desc';

export type ArticleFilterOption = 
  | 'all' 
  | 'unread' 
  | 'read';

export type ArticleViewStyle = 'list' | 'card';

// State Management with useReducer and Context API

export interface ModalState {
  addFeedOpen: boolean;
  addFolderOpen: boolean;
  renameFolder: Folder | null; // Holds the folder being renamed, or null if closed
  moveFeed: Feed | null; // Holds the feed being moved, or null if closed
}

export interface AppState {
  feeds: Feed[];
  folders: Folder[];
  articlesByFeed: { [feedId: string]: Article[] };
  allArticles: Article[]; // Articles for "All Articles" view
  
  selectedFeedId: string | null;
  selectedArticle: Article | null;
  
  isLoadingFeeds: boolean;
  isLoadingFolders: boolean;
  isLoadingSpecificFeedArticles: boolean;
  isLoadingAllArticles: boolean; // Loading state for all articles
  
  error: string | null;
  
  modalState: ModalState;
  
  isSettingsViewOpen: boolean;
  isSidebarCollapsed: boolean;

  articleSortOption: ArticleSortOption;
  articleFilterOption: ArticleFilterOption;
  articleViewStyle: ArticleViewStyle;
}

export type AppAction =
  | { type: 'INIT_APP_START' }
  | { type: 'INIT_APP_SUCCESS'; payload: { feeds: Feed[]; folders: Folder[] } }
  | { type: 'INIT_APP_FAILURE'; payload: string }
  | { type: 'LOAD_ALL_ARTICLES_START' }
  | { type: 'LOAD_ALL_ARTICLES_SUCCESS'; payload: Article[] }
  | { type: 'LOAD_ALL_ARTICLES_FAILURE'; payload: string }
  | { type: 'LOAD_SPECIFIC_ARTICLES_START'; payload: string } // feedId
  | { type: 'LOAD_SPECIFIC_ARTICLES_SUCCESS'; payload: { feedId: string; articles: Article[] } }
  | { type: 'LOAD_SPECIFIC_ARTICLES_FAILURE'; payload: { feedId: string; error: string } }
  | { type: 'SELECT_FEED'; payload: string | null }
  | { type: 'SELECT_ARTICLE'; payload: Article | null }
  | { type: 'MARK_ARTICLE_AS_READ_OPTIMISTIC'; payload: string } // articleId
  | { type: 'ADD_FEED_START' }
  | { type: 'ADD_FEED_SUCCESS'; payload: Feed }
  | { type: 'ADD_FEED_FAILURE'; payload: string }
  | { type: 'DELETE_FEED_START' }
  | { type: 'DELETE_FEED_SUCCESS'; payload: string } // feedId
  | { type: 'DELETE_FEED_FAILURE'; payload: string }
  | { type: 'ADD_FOLDER_START' }
  | { type: 'ADD_FOLDER_SUCCESS'; payload: Folder }
  | { type: 'ADD_FOLDER_FAILURE'; payload: string }
  | { type: 'RENAME_FOLDER_START' }
  | { type: 'RENAME_FOLDER_SUCCESS'; payload: Folder }
  | { type: 'RENAME_FOLDER_FAILURE'; payload: string }
  | { type: 'DELETE_FOLDER_START' }
  | { type: 'DELETE_FOLDER_SUCCESS'; payload: string } // folderId
  | { type: 'DELETE_FOLDER_FAILURE'; payload: string }
  | { type: 'MOVE_FEED_START' }
  | { type: 'MOVE_FEED_SUCCESS'; payload: Feed } // updatedFeed
  | { type: 'MOVE_FEED_FAILURE'; payload: string }
  | { type: 'OPEN_MODAL'; payload: { modalName: keyof ModalState; data?: any } }
  | { type: 'CLOSE_MODAL'; payload: keyof ModalState }
  | { type: 'TOGGLE_SETTINGS_VIEW' }
  | { type: 'CLOSE_SETTINGS_VIEW' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ARTICLE_SORT_OPTION'; payload: ArticleSortOption }
  | { type: 'SET_ARTICLE_FILTER_OPTION'; payload: ArticleFilterOption }
  | { type: 'SET_ARTICLE_VIEW_STYLE'; payload: ArticleViewStyle }
  | { type: 'SET_ERROR'; payload: string | null };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addFeed: (url: string, feedName: string, folderId?: string | null) => Promise<void>;
  deleteFeed: (feedId: string) => Promise<void>;
  addFolder: (name: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  moveFeedToFolder: (feedId: string, targetFolderId: string | null) => Promise<void>;
  selectFeed: (feedId: string | null) => Promise<void>;
  markArticleAsReadService: (articleId: string) => Promise<void>;
}
