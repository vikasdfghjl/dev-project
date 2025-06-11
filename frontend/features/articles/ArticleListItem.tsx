import React from "react";
import type { Article } from "../../types/entities";
import { ChevronRightIcon } from "../shared";
import { formatDate } from "../../utils/dateUtils";

interface ArticleListItemProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  showFeedTitle?: boolean;
}

const ArticleListItemComponent: React.FC<ArticleListItemProps> = ({
  article,
  isSelected,
  onSelect,
  showFeedTitle = false,
}) => {
  return (
    <li
      className={`
        p-4 cursor-pointer transition-colors duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset dark:focus:ring-offset-slate-850
        ${
          isSelected
            ? "bg-primary/10 dark:bg-primary-dark/20"
            : "hover:bg-muted dark:hover:bg-slate-800"
        }
        ${
          !article.isRead && !isSelected
            ? "border-l-4 border-primary dark:border-primary-dark"
            : "border-l-4 border-transparent"
        }
      `}
      onClick={onSelect}
      onKeyDown={e => e.key === "Enter" && onSelect()}
      tabIndex={0}
      role="article"
      aria-selected={isSelected}
      style={{
        paddingLeft:
          !article.isRead && !isSelected ? "calc(1rem - 4px)" : "1rem",
      }}
    >
      <div className="flex items-start space-x-4">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt="" // Decorative, title provides context
            className="hidden sm:block w-24 h-24 sm:w-32 sm:h-20 object-cover rounded-md flex-shrink-0 bg-slate-200 dark:bg-slate-700"
            onError={e => (e.currentTarget.style.display = "none")}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              isSelected
                ? "text-primary dark:text-primary-dark"
                : "text-foreground dark:text-slate-100"
            } ${!article.isRead && !isSelected ? "font-bold" : ""}`}
          >
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-slate-400 mb-2 line-clamp-2">
            {article.contentSnippet}
          </p>
          <div className="text-xs text-muted-foreground dark:text-slate-500 flex items-center flex-wrap gap-x-2">
            {article.author && (
              <span className="truncate max-w-[120px]">{article.author}</span>
            )}
            {article.author && <span className="hidden sm:inline">&bull;</span>}
            <span>{formatDate(article.pubDate)}</span>
            {showFeedTitle && article.feedTitle && (
              <>
                <span className="hidden sm:inline">&bull;</span>
                <span
                  className="font-medium text-primary/80 dark:text-primary-dark/80 truncate max-w-[150px] sm:max-w-[200px]"
                  title={article.feedTitle}
                >
                  {article.feedTitle}
                </span>
              </>
            )}
          </div>
        </div>
        <ChevronRightIcon
          className={`h-6 w-6 text-muted-foreground dark:text-slate-500 self-center flex-shrink-0 ${
            isSelected ? "text-primary dark:text-primary-dark" : ""
          }`}
        />
      </div>
    </li>
  );
};
export const ArticleListItem = React.memo(ArticleListItemComponent);
