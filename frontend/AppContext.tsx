import React, { createContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { AppContextType, Article } from './types';
import { appReducer, initialState } from './AppReducer';
import { rssService } from './services';
import { useLocalStorage } from './hooks';
import { ALL_ARTICLES_VIEW_ID } from './constants';

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Use the custom hook for localStorage management
  const [refreshIntervalMinutes] = useLocalStorage('refreshIntervalMinutes', 15);

  // Track last API operation to avoid conflicting refreshes
  const lastApiOperationRef = useRef<number>(0);

  // Background refresh timer using the selected interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const doRefresh = () => {
      // Don't refresh if there was a recent API operation (within last 10 seconds)
      const timeSinceLastOperation = Date.now() - lastApiOperationRef.current;
      if (timeSinceLastOperation < 10000) {
        // Removed debug logging for production
        return;
      }
      
      // Removed debug logging for production
      dispatch({ type: 'INIT_APP_START' });
      Promise.all([rssService.getFeeds(), rssService.getFolders()])
        .then(([feeds, folders]) => {
          dispatch({ type: 'INIT_APP_SUCCESS', payload: { feeds, folders } });
        })
        .catch(err => dispatch({ type: 'INIT_APP_FAILURE', payload: err.message || 'Failed to refresh feeds' }));
    };
    doRefresh(); // Initial refresh
    timer = setInterval(doRefresh, refreshIntervalMinutes * 60 * 1000);
    return () => clearInterval(timer);
  }, [refreshIntervalMinutes]); // Re-run when interval changes

  // Initial data loading
  useEffect(() => {
    // Removed debug logging for production
    dispatch({ type: 'INIT_APP_START' });
    Promise.all([rssService.getFeeds(), rssService.getFolders()])
      .then(([feeds, folders]) => {
        // Removed debug logging for production
        dispatch({ type: 'INIT_APP_SUCCESS', payload: { feeds, folders } });
        // Trigger loading all articles if "All Articles" is default
        if (initialState.selectedFeedId === ALL_ARTICLES_VIEW_ID && feeds.length > 0) {
            dispatch({ type: 'LOAD_ALL_ARTICLES_START' });
            const articlePromises = feeds.map(feed => rssService.getArticles(feed.id));
            Promise.allSettled(articlePromises)
                .then(results => {
                    const successfullyFetchedArticles: Article[] = [];
                    results.forEach(result => {
                        if (result.status === 'fulfilled' && result.value) {
                            successfullyFetchedArticles.push(...result.value);
                        } else if (result.status === 'rejected') {
                            // Keep warning for failed fetches
                        }
                    });
                    dispatch({ type: 'LOAD_ALL_ARTICLES_SUCCESS', payload: successfullyFetchedArticles });
                })
                .catch(err => dispatch({ type: 'LOAD_ALL_ARTICLES_FAILURE', payload: err.message || 'Failed to load all articles initially' }));
        }
      })
      .catch(err => {
        // Keep error logging for failures
        console.error('❌ Initial app loading failed:', err);
        dispatch({ type: 'INIT_APP_FAILURE', payload: err.message || 'Failed to initialize app' });
      });
  }, []);


  // Effect to load all articles when feeds change and "All Articles" view is selected
  useEffect(() => {
    if (state.selectedFeedId === ALL_ARTICLES_VIEW_ID && state.feeds.length > 0 && !state.isLoadingFeeds) { // !state.isLoadingFeeds ensures feeds are loaded
      dispatch({ type: 'LOAD_ALL_ARTICLES_START' });
      const articlePromises = state.feeds.map(feed => rssService.getArticles(feed.id));
      Promise.allSettled(articlePromises)
        .then(results => {
            const successfullyFetchedArticles: Article[] = [];
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    successfullyFetchedArticles.push(...result.value);
                } else if (result.status === 'rejected') {
                    console.warn(`Failed to load articles for a feed during "All Articles" fetch:`, result.reason);
                }
            });
            dispatch({ type: 'LOAD_ALL_ARTICLES_SUCCESS', payload: successfullyFetchedArticles });
        })
        .catch(err => dispatch({ type: 'LOAD_ALL_ARTICLES_FAILURE', payload: err.message || 'Failed to load all articles' }));
    } else if (state.selectedFeedId === ALL_ARTICLES_VIEW_ID && state.feeds.length === 0) {
        dispatch({ type: 'LOAD_ALL_ARTICLES_SUCCESS', payload: [] }); // Clear if no feeds
    }
  }, [state.feeds, state.selectedFeedId, state.isLoadingFeeds]);


  // Async action creators
  const addFeed = useCallback(async (url: string, feedName: string, folderId?: string | null) => {
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'ADD_FEED_START' });
    try {
      const newFeed = await rssService.addFeed(url, feedName, folderId ?? null);
      dispatch({ type: 'ADD_FEED_SUCCESS', payload: newFeed });
    } catch (err: any) {
      dispatch({ type: 'ADD_FEED_FAILURE', payload: err.message || 'Failed to add feed' });
      throw err; // Re-throw for modal error handling
    }
  }, []);

  const deleteFeed = useCallback(async (feedId: string) => {
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'DELETE_FEED_START' });
    try {
      await rssService.deleteFeed(feedId);
      dispatch({ type: 'DELETE_FEED_SUCCESS', payload: feedId });
    } catch (err: any) {
      dispatch({ type: 'DELETE_FEED_FAILURE', payload: err.message || 'Failed to delete feed' });
    }
  }, []);
  
  const addFolder = useCallback(async (name: string) => {
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'ADD_FOLDER_START' });
    try {
      const newFolder = await rssService.addFolder(name);
      dispatch({ type: 'ADD_FOLDER_SUCCESS', payload: newFolder });
    } catch (err: any) {
      dispatch({ type: 'ADD_FOLDER_FAILURE', payload: err.message || 'Failed to add folder' });
      throw err;
    }
  }, []);

  const renameFolder = useCallback(async (folderId: string, newName: string) => {
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'RENAME_FOLDER_START' });
    try {
      const updatedFolder = await rssService.renameFolder(folderId, newName);
      dispatch({ type: 'RENAME_FOLDER_SUCCESS', payload: updatedFolder });
    } catch (err: any) {
      dispatch({ type: 'RENAME_FOLDER_FAILURE', payload: err.message || 'Failed to rename folder' });
      throw err;
    }
  }, []);
  
  const deleteFolder = useCallback(async (folderId: string) => {
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'DELETE_FOLDER_START' });
    try {
      await rssService.deleteFolder(folderId);
      dispatch({ type: 'DELETE_FOLDER_SUCCESS', payload: folderId });
    } catch (err: any) {
      dispatch({ type: 'DELETE_FOLDER_FAILURE', payload: err.message || 'Failed to delete folder' });
    }
  }, []);

  const moveFeedToFolder = useCallback(async (feedId: string, targetFolderId: string | null) => {
    console.log('🔄 MoveFeedToFolder called:', { feedId, targetFolderId });
    lastApiOperationRef.current = Date.now();
    dispatch({ type: 'MOVE_FEED_START' });
    try {
      const updatedFeed = await rssService.moveFeedToFolder(feedId, targetFolderId);
      console.log('✅ Move feed API response:', updatedFeed);
      dispatch({ type: 'MOVE_FEED_SUCCESS', payload: updatedFeed });
      console.log('✅ Dispatched MOVE_FEED_SUCCESS');
    } catch (err: any) {
      console.error('❌ Move feed failed:', err);
      dispatch({ type: 'MOVE_FEED_FAILURE', payload: err.message || 'Failed to move feed' });
      throw err;
    }
  }, []);

  const selectFeed = useCallback(async (feedId: string | null) => {
    dispatch({ type: 'SELECT_FEED', payload: feedId });
    if (feedId && feedId !== ALL_ARTICLES_VIEW_ID) {
      // Load specific articles if not already loaded and not currently loading
      if (!state.articlesByFeed[feedId] && !state.isLoadingSpecificFeedArticles) {
        dispatch({ type: 'LOAD_SPECIFIC_ARTICLES_START', payload: feedId });
        try {
          const articles = await rssService.getArticles(feedId);
          dispatch({ type: 'LOAD_SPECIFIC_ARTICLES_SUCCESS', payload: { feedId, articles } });
        } catch (err: any) {
          dispatch({ type: 'LOAD_SPECIFIC_ARTICLES_FAILURE', payload: { feedId, error: err.message || 'Failed to load articles' } });
        }
      }
    }
    // Loading for ALL_ARTICLES_VIEW_ID is handled by the separate useEffect
  }, [state.articlesByFeed, state.isLoadingSpecificFeedArticles]);

  const markArticleAsReadService = useCallback(async (articleId: string) => {
    // Optimistic update is handled in reducer
    // Here we just call the service
    try {
        await rssService.markArticleAsRead(articleId);
    } catch (err) {
        console.warn("Failed to mark article as read on backend", err);
        // Potentially dispatch an action to revert optimistic update or show error
    }
  }, []);


  const contextValue: AppContextType = {
    state,
    dispatch,
    addFeed, // (url, feedName, folderId)
    deleteFeed,
    addFolder,
    renameFolder,
    deleteFolder,
    moveFeedToFolder,
    selectFeed,
    markArticleAsReadService,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
