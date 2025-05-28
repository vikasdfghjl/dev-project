import React from 'react';
import type { Article } from '../../../types/entities';
import { formatDateCompact, formatRelativeDate } from '../../../utils/dateUtils';

interface ArticleCardItemProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  showFeedTitle?: boolean;
}

const ArticleCardItemComponent: React.FC<ArticleCardItemProps> = ({ article, isSelected, onSelect, showFeedTitle = false }) => {
  // Format the date, falling back to relative time if the date is invalid
  const formattedDate = (() => {
    try {
      return formatDateCompact(article.pubDate);
    } catch (e) {
      return formatRelativeDate(article.pubDate);
    }
  })();

  // Extract the first image URL from content if imageUrl is not set
  const imageUrl = article.imageUrl || (() => {
    if (article.content) {
      const imgMatch = article.content.match(/<img[^>]+src="([^">]+)"/);
      return imgMatch ? imgMatch[1] : null;
    }
    return null;
  })();

  return (
    <div
      className={`
        bg-card dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out
        flex flex-col cursor-pointer overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-offset-slate-850
        ${isSelected ? 'ring-2 ring-primary dark:ring-primary-dark' : 'border border-border dark:border-slate-700'}
        ${!article.isRead && !isSelected ? 'border-l-4 border-primary dark:border-primary-dark' : ''}
      `}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      tabIndex={0}
      role="article"
      aria-selected={isSelected}
    >
      {imageUrl && (
        <div className="w-full h-44 bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          <img 
            src={imageUrl} 
            alt={article.title || 'Article image'}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className={`text-md font-semibold mb-2 ${isSelected ? 'text-primary dark:text-primary-dark' : 'text-foreground dark:text-slate-100'} ${!article.isRead && !isSelected ? 'font-bold' : ''} line-clamp-2`}>
          {article.title}
        </h3>
        <div className="flex items-center text-xs text-muted-foreground dark:text-slate-400 mb-2 gap-2">
          {article.author && <span className="truncate max-w-[120px] font-medium">{article.author}</span>}
          {article.author && <span className="mx-1">•</span>}
          <span>{formattedDate}</span>
        </div>
        <p className="text-sm text-muted-foreground dark:text-slate-400 mb-3 line-clamp-3 flex-1">
          {article.contentSnippet || article.content?.replace(/<[^>]+>/g, '') || 'No summary available.'}
        </p>
        <div className="text-xs text-muted-foreground dark:text-slate-500 mt-auto flex flex-col gap-1">
          {showFeedTitle && article.feedTitle && (
            <p className="font-medium text-primary/80 dark:text-primary-dark/80 truncate mb-0.5" title={article.feedTitle}>
              {article.feedTitle}
            </p>
          )}
          {article.link && (
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-primary-dark text-xs truncate">
              Read full article
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const ArticleCardItem = React.memo(ArticleCardItemComponent);
