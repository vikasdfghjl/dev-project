import React, { useContext, useMemo } from 'react';
import { AppProvider, AppContext } from './AppContext'; // Import AppProvider and AppContext
import { useArticleFiltering } from './hooks';
import { ErrorBoundary, AsyncErrorBoundary } from './features/shared/ui';
import { Header, Sidebar, MainContentArea } from './features/layout';
import { ArticleView } from './features/articles/ArticleView';
import { AddFeedModal, MoveFeedToFolderModal } from './features/feeds';
import { AddFolderModal, RenameFolderModal } from './features/folders';
import { SettingsPage } from './features/settings';
import type { Feed, Article } from './types';
import { ALL_ARTICLES_VIEW_ID } from './constants';
import { rssService } from './services';

// This component will now consume the context
const AppContent: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    // This should not happen if AppContent is rendered within AppProvider
    return <div>Loading context...</div>;
  }
  const { state, dispatch, addFeed, deleteFeed, addFolder, renameFolder, deleteFolder, moveFeedToFolder, selectFeed, markArticleAsReadService } = context;


  const handleSelectArticle = (article: Article) => {
    dispatch({ type: 'SELECT_ARTICLE', payload: article });
    if (!article.isRead) {
        dispatch({type: 'MARK_ARTICLE_AS_READ_OPTIMISTIC', payload: article.id});
        markArticleAsReadService(article.id);
    }
  };

  // Get source articles based on selected feed
  const sourceArticles = useMemo(() => {
    if (state.selectedFeedId === ALL_ARTICLES_VIEW_ID) {
      return state.allArticles;
    } else if (state.selectedFeedId && state.articlesByFeed[state.selectedFeedId]) {
      return state.articlesByFeed[state.selectedFeedId];
    } else {
      return [];
    }
  }, [state.selectedFeedId, state.allArticles, state.articlesByFeed]);

  // Use the custom hook for filtering and sorting
  const {
    filteredAndSortedArticles: sortedAndFilteredArticles,
    setSortOption,
    setFilterOption
  } = useArticleFiltering({
    articles: sourceArticles,
    initialSortOption: state.articleSortOption,
    initialFilterOption: state.articleFilterOption
  });

  // Sync hook state with app state changes
  React.useEffect(() => {
    setSortOption(state.articleSortOption);
  }, [state.articleSortOption, setSortOption]);

  React.useEffect(() => {
    setFilterOption(state.articleFilterOption);
  }, [state.articleFilterOption, setFilterOption]);

  const feedsByFolder = useMemo(() => {
    console.log('🔄 Calculating feedsByFolder with feeds:', state.feeds);
    console.log('🔄 Calculating feedsByFolder with folders:', state.folders);
    const result: { [folderId: string]: Feed[] } = {};
    state.folders.forEach(folder => result[folder.id] = []);
    state.feeds.forEach(feed => {
      console.log(`🔍 Processing feed ${feed.title} with folderId: ${feed.folderId}`);
      if (feed.folderId && result[feed.folderId]) {
        result[feed.folderId].push(feed);
        console.log(`✅ Added feed ${feed.title} to folder ${feed.folderId}`);
      } else {
        console.log(`⚠️ Feed ${feed.title} not added to any folder (folderId: ${feed.folderId})`);
      }
    });
    console.log('📊 Final feedsByFolder result:', result);
    return result;
  }, [state.feeds, state.folders]);

  const ungroupedFeeds = useMemo(() => {
    const result = state.feeds.filter(feed => !feed.folderId);
    console.log('📊 Ungrouped feeds:', result);
    return result;
  }, [state.feeds]);

  const initialAppLoading = state.isLoadingFeeds || state.isLoadingFolders;

  // Handler for instant refresh
  const handleRefreshFeeds = async () => {
    dispatch({ type: 'INIT_APP_START' });
    try {
      const [feeds, folders] = await Promise.all([
        rssService.getFeeds(),
        rssService.getFolders()
      ]);
      dispatch({ type: 'INIT_APP_SUCCESS', payload: { feeds, folders } });
      // Optionally, reload articles for all feeds
      if (feeds && feeds.length > 0) {
        dispatch({ type: 'LOAD_ALL_ARTICLES_START' });
        const articlePromises = feeds.map((feed: Feed) => rssService.getArticles(feed.id));
        const results = await Promise.allSettled(articlePromises);
        const successfullyFetchedArticles: Article[] = [];
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            successfullyFetchedArticles.push(...result.value as Article[]);
          }
        });
        dispatch({ type: 'LOAD_ALL_ARTICLES_SUCCESS', payload: successfullyFetchedArticles });
      }
    } catch (err: any) {
      dispatch({ type: 'INIT_APP_FAILURE', payload: err.message || 'Failed to refresh feeds' });
    }
  };

  // Fix for 'never' type error
  const selectedArticle: Article | null = state.selectedArticle;

  return (
    <div className="flex flex-col h-screen bg-muted dark:bg-slate-900 text-foreground dark:text-slate-100 antialiased">
      <ErrorBoundary>
        <Header onAddFeedClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'addFeedOpen' }})} onRefreshFeeds={handleRefreshFeeds} />
      </ErrorBoundary>
      <div className="flex flex-1 overflow-hidden">
        <ErrorBoundary>
          <Sidebar
            folders={state.folders}
            feedsByFolder={feedsByFolder}
            ungroupedFeeds={ungroupedFeeds}
            selectedFeedId={state.selectedFeedId}
            onSelectFeed={selectFeed} // Use context action
            onDeleteFeed={deleteFeed} // Use context action
            isLoading={initialAppLoading}
            onAddFeedClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'addFeedOpen' }})}
            onAddFolderClick={() => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'addFolderOpen' }})}
            onEditFolder={(folder) => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'renameFolder', data: folder }})}
            onDeleteFolder={deleteFolder} // Use context action
            onMoveFeed={(feed) => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'moveFeed', data: feed }})}
            onOpenSettingsClick={() => dispatch({ type: 'TOGGLE_SETTINGS_VIEW' })}
            isCollapsed={state.isSidebarCollapsed} 
            onToggleCollapse={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} 
          />
        </ErrorBoundary>
        <main className="flex-1 flex flex-col overflow-y-auto bg-background dark:bg-slate-850">
          {state.error && (
            <div className="p-4 m-4 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600 shadow">
              <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold">Error</p>
                    <p>{state.error}</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
                    className="ml-4 p-1 text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100 rounded-full hover:bg-red-100 dark:hover:bg-red-700/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Dismiss error"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
            </div>
          )}
          
          {state.isSettingsViewOpen ? (
            <ErrorBoundary>
              <SettingsPage 
                onCloseSettings={() => dispatch({ type: 'CLOSE_SETTINGS_VIEW' })}
                feeds={state.feeds} 
                folders={state.folders}
                onAddFeedClick={() => { dispatch({type: 'CLOSE_SETTINGS_VIEW'}); dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'addFeedOpen' }});}}
                onDeleteFeed={deleteFeed} // Use context action
                onMoveFeed={(feed) => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'moveFeed', data: feed }})}
                onAddFolderClick={() => { dispatch({type: 'CLOSE_SETTINGS_VIEW'}); dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'addFolderOpen' }});}}
                onRenameFolder={(folder) => dispatch({ type: 'OPEN_MODAL', payload: { modalName: 'renameFolder', data: folder }})}
                onDeleteFolder={deleteFolder} // Use context action
              />
            </ErrorBoundary>
          ) : state.selectedArticle ? (
            <ErrorBoundary>
              <ArticleView article={state.selectedArticle} onBack={() => dispatch({ type: 'SELECT_ARTICLE', payload: null })} />
            </ErrorBoundary>
          ) : (
            <AsyncErrorBoundary onRetry={handleRefreshFeeds}>
              <MainContentArea
                initialAppLoading={initialAppLoading}
                selectedFeedId={state.selectedFeedId}
                isLoadingAllArticles={state.isLoadingAllArticles}
                isLoadingSpecificFeedArticles={state.isLoadingSpecificFeedArticles}
                allArticles={state.allArticles}
                articlesByFeed={state.articlesByFeed}
                feeds={state.feeds}
                sortedAndFilteredArticles={sortedAndFilteredArticles}
                onSelectArticle={handleSelectArticle}
                selectedArticleId={selectedArticle ? selectedArticle.id : null}
                articleSortOption={state.articleSortOption}
                onSortChange={(option) => dispatch({ type: 'SET_ARTICLE_SORT_OPTION', payload: option })}
                articleFilterOption={state.articleFilterOption}
                onFilterChange={(option) => dispatch({ type: 'SET_ARTICLE_FILTER_OPTION', payload: option })}
                articleViewStyle={state.articleViewStyle}
                onArticleViewStyleChange={(style) => dispatch({ type: 'SET_ARTICLE_VIEW_STYLE', payload: style })}
              />
            </AsyncErrorBoundary>
          )}
        </main>
      </div>
      {state.modalState.addFeedOpen && (
        <AddFeedModal
          folders={state.folders}
          onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: 'addFeedOpen' })}
          onAddFeed={addFeed} // Use context action
        />
      )}
      {state.modalState.addFolderOpen && (
        <AddFolderModal
          onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: 'addFolderOpen' })}
          onAddFolder={addFolder} // Use context action
        />
      )}
      {state.modalState.renameFolder && (
        <RenameFolderModal
          folder={state.modalState.renameFolder}
          onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: 'renameFolder' })}
          onRenameFolder={renameFolder} // Use context action
        />
      )}
      {state.modalState.moveFeed && (
        <MoveFeedToFolderModal
          feed={state.modalState.moveFeed}
          folders={state.folders}
          onClose={() => dispatch({ type: 'CLOSE_MODAL', payload: 'moveFeed' })}
          onMoveFeed={moveFeedToFolder} // Use context action
        />
      )}
    </div>
  );
};

// The main App component now just sets up the provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
