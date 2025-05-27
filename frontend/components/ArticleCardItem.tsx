import React from 'react';
import type { Article } from '../types';

interface ArticleCardItemProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  showFeedTitle?: boolean;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown date';
  // Try native Date first
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // Try manual RFC822 parsing for common RSS pubDate formats
  // e.g. 'Tue, 27 May 2025 10:02:55 -0400'
  // Date.parse should handle this, but let's try a fallback for edge cases
  const rfc822 = dateString.replace(/(\d{2}):(\d{2}):(\d{2}) ([-+]\d{4})$/, '$1:$2:$3 GMT$4');
  date = new Date(rfc822);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // If all fails
  return 'Unknown date';
};

const ArticleCardItemComponent: React.FC<ArticleCardItemProps> = ({ article, isSelected, onSelect, showFeedTitle = false }) => {
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
      {article.imageUrl && (
        <div className="w-full h-44 bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title || 'Article image'}
            className="w-full h-full object-cover object-center"
            onError={(e) => (e.currentTarget.style.display = 'none')}
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
          <span>{formatDate(article.pubDate)}</span>
        </div>
        <p className="text-sm text-muted-foreground dark:text-slate-400 mb-3 line-clamp-3 flex-1">
          {article.contentSnippet || article.content || 'No summary available.'}
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
