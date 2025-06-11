import React from "react";
import type {
  ArticleSortOption,
  ArticleFilterOption,
  ArticleViewStyle,
} from "../../types/entities";
import { ListViewIcon, CardViewIcon } from "../shared";

interface ArticleListHeaderProps {
  feedTitle: string;
  articleCount: number;
  sortOption: ArticleSortOption;
  onSortChange: (option: ArticleSortOption) => void;
  filterOption: ArticleFilterOption;
  onFilterChange: (option: ArticleFilterOption) => void;
  viewStyle: ArticleViewStyle;
  onViewStyleChange: (style: ArticleViewStyle) => void;
}

const ArticleListHeaderComponent: React.FC<ArticleListHeaderProps> = ({
  feedTitle,
  articleCount,
  sortOption,
  onSortChange,
  filterOption,
  onFilterChange,
  viewStyle,
  onViewStyleChange,
}) => {
  const controlStyles =
    "px-3 py-2 border border-border dark:border-slate-600 rounded-md bg-background dark:bg-slate-700 text-sm text-foreground dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark";
  const iconButtonBaseStyles =
    "p-2 rounded-md border border-border dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark";
  const iconButtonActiveStyles =
    "bg-primary/15 text-primary dark:bg-primary-dark/25 dark:text-primary-dark";
  const iconButtonInactiveStyles =
    "bg-background dark:bg-slate-700 text-muted-foreground dark:text-slate-400 hover:bg-muted dark:hover:bg-slate-600";

  return (
    <div className="p-4 border-b border-border dark:border-slate-700 sticky top-0 bg-background/95 dark:bg-slate-850/95 backdrop-blur-sm z-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-3 sm:mb-0">
          <h2
            className="text-xl font-semibold text-foreground dark:text-slate-200 truncate"
            title={feedTitle}
          >
            {feedTitle}
          </h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            {articleCount} article(s) displayed
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div>
            <label htmlFor="filter-select" className="sr-only">
              Filter by:
            </label>
            <select
              id="filter-select"
              value={filterOption}
              onChange={e =>
                onFilterChange(e.target.value as ArticleFilterOption)
              }
              className={controlStyles}
              aria-label="Filter articles"
            >
              <option value="all">Show All</option>
              <option value="unread">Show Unread</option>
              <option value="read">Show Read</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-select" className="sr-only">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={e => onSortChange(e.target.value as ArticleSortOption)}
              className={controlStyles}
              aria-label="Sort articles"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 border border-border dark:border-slate-600 rounded-md p-0.5 bg-background dark:bg-slate-700">
            <button
              onClick={() => onViewStyleChange("list")}
              className={`${iconButtonBaseStyles} ${
                viewStyle === "list"
                  ? iconButtonActiveStyles
                  : iconButtonInactiveStyles
              }`}
              title="List View"
              aria-pressed={viewStyle === "list"}
            >
              <ListViewIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewStyleChange("card")}
              className={`${iconButtonBaseStyles} ${
                viewStyle === "card"
                  ? iconButtonActiveStyles
                  : iconButtonInactiveStyles
              }`}
              title="Card View"
              aria-pressed={viewStyle === "card"}
            >
              <CardViewIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const ArticleListHeader = React.memo(ArticleListHeaderComponent);
