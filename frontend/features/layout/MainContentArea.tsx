import React from 'react';
import type { Article, Feed, ArticleSortOption, ArticleFilterOption, ArticleViewStyle } from '../../types/entities';
import { ArticleList } from '../articles/ArticleList';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';
import { RssIcon } from '../shared/icons/RssIcon';
import { ALL_ARTICLES_VIEW_ID } from '../../constants';

interface MainContentAreaProps {
  initialAppLoading: boolean;
  selectedFeedId: string | null;
  isLoadingAllArticles: boolean;
  isLoadingSpecificFeedArticles: boolean;
  allArticles: Article[];
  articlesByFeed: { [feedId: string]: Article[] };
  feeds: Feed[];
  sortedAndFilteredArticles: Article[];
  onSelectArticle: (article: Article) => void;
  selectedArticleId: string | null;
  articleSortOption: ArticleSortOption;
  onSortChange: (option: ArticleSortOption) => void;
  articleFilterOption: ArticleFilterOption;
  onFilterChange: (option: ArticleFilterOption) => void;
  articleViewStyle: ArticleViewStyle;
  onArticleViewStyleChange: (style: ArticleViewStyle) => void;
}

const MainContentAreaComponent: React.FC<MainContentAreaProps> = ({
  initialAppLoading,
  selectedFeedId,
  isLoadingAllArticles,
  isLoadingSpecificFeedArticles,
  allArticles,
  articlesByFeed,
  feeds,
  sortedAndFilteredArticles,
  onSelectArticle,
  selectedArticleId,
  articleSortOption,
  onSortChange,
  articleFilterOption,
  onFilterChange,
  articleViewStyle,
  onArticleViewStyleChange,
}) => {
  if (initialAppLoading) {
    return <div className="flex-1 flex items-center justify-center p-4"><LoadingSpinner size="lg" /></div>;
  }

  if (selectedFeedId === ALL_ARTICLES_VIEW_ID) {
    if (isLoadingAllArticles && allArticles.length === 0) {
      return <div className="flex-1 flex items-center justify-center p-4"><LoadingSpinner size="lg" /></div>;
    }
    return (
      <ArticleList
        articles={sortedAndFilteredArticles}
        onSelectArticle={onSelectArticle}
        selectedArticleId={selectedArticleId}
        feedTitle="All Articles"
        sortOption={articleSortOption}
        onSortChange={onSortChange}
        filterOption={articleFilterOption}
        onFilterChange={onFilterChange}
        totalFeedsCount={feeds.length}
        viewStyle={articleViewStyle}
        onViewStyleChange={onArticleViewStyleChange}
      />
    );
  }
  
  if (selectedFeedId && (articlesByFeed[selectedFeedId] || isLoadingSpecificFeedArticles)) {
    if (isLoadingSpecificFeedArticles && !articlesByFeed[selectedFeedId]) {
      return <div className="flex-1 flex items-center justify-center p-4"><LoadingSpinner size="lg" /></div>;
    }
    return (
      <ArticleList
        articles={sortedAndFilteredArticles}
        onSelectArticle={onSelectArticle}
        selectedArticleId={selectedArticleId}
        feedTitle={feeds.find(f => f.id === selectedFeedId)?.title || 'Articles'}
        sortOption={articleSortOption}
        onSortChange={onSortChange}
        filterOption={articleFilterOption}
        onFilterChange={onFilterChange}
        totalFeedsCount={feeds.length}
        viewStyle={articleViewStyle}
        onViewStyleChange={onArticleViewStyleChange}
      />
    );
  }

  // Default welcome message or prompt to select/add feeds
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <RssIcon className="w-24 h-24 text-muted-foreground dark:text-slate-600 mb-6" />
      <h2 className="text-2xl font-semibold text-foreground dark:text-slate-300 mb-2">Welcome to RSS Aggregator Pro</h2>
      <p className="text-muted-foreground dark:text-slate-400 max-w-md">
        {feeds.length === 0 ? "Add your first feed to get started." : "Select a feed, folder, or 'All Articles' to view content."}
      </p>
    </div>
  );
};
export const MainContentArea = React.memo(MainContentAreaComponent);
