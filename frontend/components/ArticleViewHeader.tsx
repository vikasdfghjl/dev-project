
import React from 'react';
import type { Article } from '../types';

interface ArticleViewHeaderProps {
  article: Pick<Article, 'title' | 'author' | 'pubDate' | 'feedTitle' | 'imageUrl' | 'content'>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit'});
};

const ArticleViewHeaderComponent: React.FC<ArticleViewHeaderProps> = ({ article }) => {
  return (
    <>
      {article.imageUrl && !article.content?.includes("<img") && (
         <img src={article.imageUrl} alt={article.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 shadow-md" />
      )}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground dark:text-slate-100">{article.title}</h1>
      <div className="text-sm text-muted-foreground dark:text-slate-400 mb-6 space-x-2">
        {article.author && <span>By {article.author}</span>}
        {article.author && <span>&bull;</span>}
        <span>{formatDate(article.pubDate)}</span>
        {article.feedTitle && <span>&bull;</span>}
        {article.feedTitle && <span className="font-medium">{article.feedTitle}</span>}
      </div>
    </>
  );
};
export const ArticleViewHeader = React.memo(ArticleViewHeaderComponent);
