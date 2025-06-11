import React from "react";
import type {
  Article,
  ArticleSortOption,
  ArticleFilterOption,
  ArticleViewStyle,
} from "../../types/entities";
import { ArticleListItem } from "./ArticleListItem";
import { ArticleCardItem } from "./components/ArticleCardItem";
import { ArticleListHeader } from "./ArticleListHeader";
import { ArticleListEmptyState } from "./components/ArticleListEmptyState";

interface ArticleListProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  selectedArticleId: string | null;
  feedTitle: string;
  sortOption: ArticleSortOption;
  onSortChange: (option: ArticleSortOption) => void;
  filterOption: ArticleFilterOption;
  onFilterChange: (option: ArticleFilterOption) => void;
  totalFeedsCount: number;
  viewStyle: ArticleViewStyle;
  onViewStyleChange: (style: ArticleViewStyle) => void;
}

function groupArticlesByDate(articles: Article[]) {
  return articles.reduce(
    (acc, article) => {
      const date = article.pubDate ? new Date(article.pubDate) : null;
      const dateKey =
        date && !isNaN(date.getTime())
          ? date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Unknown date";
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(article);
      return acc;
    },
    {} as Record<string, Article[]>
  );
}

const ArticleListComponent: React.FC<ArticleListProps> = ({
  articles,
  onSelectArticle,
  selectedArticleId,
  feedTitle,
  sortOption,
  onSortChange,
  filterOption,
  onFilterChange,
  totalFeedsCount,
  viewStyle,
  onViewStyleChange,
}) => {
  const isAllArticlesView = feedTitle === "All Articles";

  if (articles.length === 0) {
    return (
      <ArticleListEmptyState
        feedTitle={feedTitle}
        totalFeedsCount={totalFeedsCount}
        filterOption={filterOption}
        articleCount={articles.length}
      />
    );
  }

  const grouped = groupArticlesByDate(articles);
  const dateKeys = Object.keys(grouped).sort((a, b) => {
    // Sort descending by date (newest first)
    const da = new Date(a);
    const db = new Date(b);
    return db.getTime() - da.getTime();
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <ArticleListHeader
        feedTitle={feedTitle}
        articleCount={articles.length}
        sortOption={sortOption}
        onSortChange={onSortChange}
        filterOption={filterOption}
        onFilterChange={onFilterChange}
        viewStyle={viewStyle}
        onViewStyleChange={onViewStyleChange}
      />
      {viewStyle === "list" ? (
        <ul className="divide-y divide-border dark:divide-slate-700">
          {dateKeys.map(dateKey => (
            <React.Fragment key={dateKey}>
              <li className="sticky top-0 z-10 bg-background/95 dark:bg-slate-850/95 px-4 py-2 text-xs font-semibold text-muted-foreground dark:text-slate-400 border-b border-border dark:border-slate-700">
                {dateKey}
              </li>
              {grouped[dateKey].map(article => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  isSelected={article.id === selectedArticleId}
                  onSelect={() => onSelectArticle(article)}
                  showFeedTitle={isAllArticlesView}
                />
              ))}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <div className="p-4">
          {dateKeys.map(dateKey => (
            <div key={dateKey} className="mb-8">
              <div className="mb-2 px-1 text-xs font-semibold text-muted-foreground dark:text-slate-400">
                {dateKey}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {grouped[dateKey].map(article => (
                  <ArticleCardItem
                    key={article.id}
                    article={article}
                    isSelected={article.id === selectedArticleId}
                    onSelect={() => onSelectArticle(article)}
                    showFeedTitle={isAllArticlesView}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export const ArticleList = React.memo(ArticleListComponent);
