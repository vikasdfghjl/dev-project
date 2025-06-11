import type { AppState, AppAction } from "./types";
import { ALL_ARTICLES_VIEW_ID } from "./constants";

export const initialState: AppState = {
  feeds: [],
  folders: [],
  articlesByFeed: {},
  allArticles: [],
  selectedFeedId: ALL_ARTICLES_VIEW_ID,
  selectedArticle: null,
  isLoadingFeeds: true,
  isLoadingFolders: true,
  isLoadingSpecificFeedArticles: false,
  isLoadingAllArticles: false,
  error: null,
  modalState: {
    addFeedOpen: false,
    addFolderOpen: false,
    renameFolder: null,
    moveFeed: null,
  },
  isSettingsViewOpen: false,
  isDocsViewOpen: false, // Initialize documentation view as closed
  isSidebarCollapsed: false,
  articleSortOption: "date-desc",
  articleFilterOption: "all",
  articleViewStyle: "list",
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "INIT_APP_START":
      return {
        ...state,
        isLoadingFeeds: true,
        isLoadingFolders: true,
        error: null,
      };
    case "INIT_APP_SUCCESS":
      return {
        ...state,
        feeds: action.payload.feeds,
        folders: action.payload.folders,
        isLoadingFeeds: false,
        isLoadingFolders: false,
      };
    case "INIT_APP_FAILURE":
      return {
        ...state,
        isLoadingFeeds: false,
        isLoadingFolders: false,
        error: action.payload,
      };
    case "LOAD_ALL_ARTICLES_START":
      return { ...state, isLoadingAllArticles: true, error: null };
    case "LOAD_ALL_ARTICLES_SUCCESS":
      return {
        ...state,
        isLoadingAllArticles: false,
        allArticles: action.payload,
      };
    case "LOAD_ALL_ARTICLES_FAILURE":
      return {
        ...state,
        isLoadingAllArticles: false,
        error: action.payload,
        allArticles: [],
      };
    case "LOAD_SPECIFIC_ARTICLES_START":
      return { ...state, isLoadingSpecificFeedArticles: true, error: null };
    case "LOAD_SPECIFIC_ARTICLES_SUCCESS":
      return {
        ...state,
        isLoadingSpecificFeedArticles: false,
        articlesByFeed: {
          ...state.articlesByFeed,
          [action.payload.feedId]: action.payload.articles,
        },
      };
    case "LOAD_SPECIFIC_ARTICLES_FAILURE":
      return {
        ...state,
        isLoadingSpecificFeedArticles: false,
        error: action.payload.error,
        articlesByFeed: {
          ...state.articlesByFeed,
          [action.payload.feedId]: [],
        },
      };
    case "SELECT_FEED":
      return {
        ...state,
        selectedFeedId: action.payload,
        selectedArticle: null,
        articleSortOption: "date-desc", // Reset sort/filter on feed change
        articleFilterOption: "all",
      };
    case "SELECT_ARTICLE":
      return { ...state, selectedArticle: action.payload };

    case "MARK_ARTICLE_AS_READ_OPTIMISTIC": {
      const articleId = action.payload;
      const markAsRead = (article: any) => ({ ...article, isRead: true });
      return {
        ...state,
        allArticles: state.allArticles.map(a =>
          a.id === articleId ? markAsRead(a) : a
        ),
        articlesByFeed: Object.entries(state.articlesByFeed).reduce(
          (acc, [feedId, articles]) => {
            acc[feedId] = articles.map(a =>
              a.id === articleId ? markAsRead(a) : a
            );
            return acc;
          },
          {} as AppState["articlesByFeed"]
        ),
        ...(state.selectedArticle?.id === articleId && state.selectedArticle
          ? { selectedArticle: markAsRead(state.selectedArticle) }
          : {}),
      };
    }

    case "ADD_FEED_START":
      return { ...state, isLoadingFeeds: true, error: null }; // Or a specific loading for add feed
    case "ADD_FEED_SUCCESS":
      return {
        ...state,
        isLoadingFeeds: false,
        feeds: [...state.feeds, action.payload],
        modalState: { ...state.modalState, addFeedOpen: false },
        selectedFeedId: action.payload.id, // Select the new feed
        selectedArticle: null,
      };
    case "ADD_FEED_FAILURE":
      return { ...state, isLoadingFeeds: false, error: action.payload }; // Keep modal open, error displayed inside

    case "DELETE_FEED_START":
      return { ...state, error: null }; // Can add specific loading state if needed
    case "DELETE_FEED_SUCCESS": {
      const feedIdToRemove = action.payload;
      const newFeeds = state.feeds.filter(f => f.id !== feedIdToRemove);
      const newArticlesByFeed = { ...state.articlesByFeed };
      delete newArticlesByFeed[feedIdToRemove];
      const newAllArticles = state.allArticles.filter(
        a => a.feedId !== feedIdToRemove
      );

      let newSelectedFeedId = state.selectedFeedId;
      if (state.selectedFeedId === feedIdToRemove) {
        newSelectedFeedId = newFeeds.length > 0 ? ALL_ARTICLES_VIEW_ID : null;
      } else if (
        state.selectedFeedId === ALL_ARTICLES_VIEW_ID &&
        newFeeds.length === 0
      ) {
        newSelectedFeedId = null;
      }

      return {
        ...state,
        feeds: newFeeds,
        articlesByFeed: newArticlesByFeed,
        allArticles: newAllArticles,
        selectedFeedId: newSelectedFeedId,
        selectedArticle:
          newSelectedFeedId === null ||
          newSelectedFeedId !== state.selectedFeedId
            ? null
            : state.selectedArticle,
      };
    }
    case "DELETE_FEED_FAILURE":
      return { ...state, error: action.payload };

    case "ADD_FOLDER_START":
      return { ...state, error: null };
    case "ADD_FOLDER_SUCCESS":
      return {
        ...state,
        folders: [...state.folders, action.payload],
        modalState: { ...state.modalState, addFolderOpen: false },
      };
    case "ADD_FOLDER_FAILURE":
      return { ...state, error: action.payload };

    case "RENAME_FOLDER_START":
      return { ...state, error: null };
    case "RENAME_FOLDER_SUCCESS":
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload.id ? action.payload : f
        ),
        modalState: { ...state.modalState, renameFolder: null },
      };
    case "RENAME_FOLDER_FAILURE":
      return { ...state, error: action.payload };

    case "DELETE_FOLDER_START":
      return { ...state, error: null };
    case "DELETE_FOLDER_SUCCESS":
      return {
        ...state,
        folders: state.folders.filter(f => f.id !== action.payload),
        feeds: state.feeds.map(feed =>
          feed.folderId === action.payload ? { ...feed, folderId: null } : feed
        ),
      };
    case "DELETE_FOLDER_FAILURE":
      return { ...state, error: action.payload };

    case "MOVE_FEED_START":
      return { ...state, error: null };
    case "MOVE_FEED_SUCCESS":
      console.log("🔄 MOVE_FEED_SUCCESS reducer called with:", action.payload);
      console.log("📊 Current feeds before update:", state.feeds);
      const updatedFeeds = state.feeds.map(f =>
        f.id === action.payload.id ? action.payload : f
      );
      console.log("📊 Updated feeds after update:", updatedFeeds);
      return {
        ...state,
        feeds: updatedFeeds,
        modalState: { ...state.modalState, moveFeed: null },
      };
    case "MOVE_FEED_FAILURE":
      return { ...state, error: action.payload };

    case "OPEN_MODAL": {
      const { modalName, data } = action.payload;
      if (modalName === "renameFolder" || modalName === "moveFeed") {
        return {
          ...state,
          modalState: { ...initialState.modalState, [modalName]: data },
        };
      }
      return {
        ...state,
        modalState: { ...initialState.modalState, [modalName]: true },
      };
    }
    case "CLOSE_MODAL": {
      const modalName = action.payload;
      if (modalName === "renameFolder" || modalName === "moveFeed") {
        return {
          ...state,
          modalState: { ...state.modalState, [modalName]: null },
        };
      }
      return {
        ...state,
        modalState: { ...state.modalState, [modalName]: false },
      };
    }
    case "TOGGLE_SETTINGS_VIEW":
      return {
        ...state,
        isSettingsViewOpen: !state.isSettingsViewOpen,
        isDocsViewOpen: false, // Close docs when opening settings
        selectedArticle: !state.isSettingsViewOpen
          ? null
          : state.selectedArticle, // Clear article if opening settings
      };
    case "CLOSE_SETTINGS_VIEW":
      return { ...state, isSettingsViewOpen: false };
    case "TOGGLE_DOCS_VIEW":
      return {
        ...state,
        isDocsViewOpen: !state.isDocsViewOpen,
        isSettingsViewOpen: false, // Close settings when opening docs
        selectedArticle: !state.isDocsViewOpen ? null : state.selectedArticle, // Clear article if opening docs
      };
    case "CLOSE_DOCS_VIEW":
      return { ...state, isDocsViewOpen: false };
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case "SET_ARTICLE_SORT_OPTION":
      return { ...state, articleSortOption: action.payload };
    case "SET_ARTICLE_FILTER_OPTION":
      return { ...state, articleFilterOption: action.payload };
    case "SET_ARTICLE_VIEW_STYLE":
      return { ...state, articleViewStyle: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
