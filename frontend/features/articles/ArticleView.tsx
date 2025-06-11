import React from "react";
import type { Article } from "../../types/entities";
import { ExternalLinkIcon, ChevronLeftIcon } from "../shared";
import { ArticleViewHeader } from "./ArticleViewHeader";

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleViewComponent: React.FC<ArticleViewProps> = ({
  article,
  onBack,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background dark:bg-slate-850">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-sm text-primary dark:text-primary-dark hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Back to articles
      </button>

      <article className="prose dark:prose-invert dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300 dark:prose-li:text-slate-300 dark:prose-a:text-primary-dark dark:hover:prose-a:text-primary-dark/80 dark:prose-strong:text-slate-200 lg:prose-xl max-w-4xl mx-auto">
        <ArticleViewHeader
          article={{
            title: article.title,
            author: article.author ?? "",
            pubDate: article.pubDate,
            feedTitle: article.feedTitle,
            imageUrl: article.imageUrl,
            content: article.content,
          }}
        />

        {article.content ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p>
            {article.contentSnippet || "No content available for this article."}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-border dark:border-slate-700">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary dark:text-primary-dark hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
          >
            Read original article
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
        </div>
      </article>
    </div>
  );
};
export const ArticleView = React.memo(ArticleViewComponent);
