import React from "react";
import { BookOpenIcon } from "../../shared";
import type { ArticleFilterOption } from "../../../types/entities";

interface ArticleListEmptyStateProps {
  feedTitle: string;
  totalFeedsCount: number;
  filterOption: ArticleFilterOption; // To know if it's empty due to filter
  articleCount: number; // To distinguish between no articles at all vs. no articles for filter
}

const ArticleListEmptyStateComponent: React.FC<ArticleListEmptyStateProps> = ({
  feedTitle,
  totalFeedsCount,
  filterOption,
  articleCount,
}) => {
  const isAllArticlesView = feedTitle === "All Articles";

  if (articleCount === 0 && filterOption !== "all") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <BookOpenIcon className="w-16 h-16 text-muted-foreground dark:text-slate-600 mb-4" />
        <h2 className="text-lg font-semibold text-foreground dark:text-slate-300 mb-1">
          No articles match filter
        </h2>
        <p className="text-muted-foreground dark:text-slate-400 max-w-sm">
          No articles found for the filter:{" "}
          <span className="font-medium text-foreground dark:text-slate-300">
            {filterOption}
          </span>{" "}
          in "{feedTitle}".
        </p>
      </div>
    );
  }

  // General empty state (filter is 'all' but still no articles)
  let messageTitle = "No Articles Found";
  let messageBody = `There are no articles in "${feedTitle}", or they couldn't be loaded. Try selecting another feed or refreshing.`;

  if (isAllArticlesView && totalFeedsCount === 0) {
    messageTitle = "No Feeds Added Yet";
    messageBody =
      "You haven't added any RSS feeds. Click 'Add Feed' in the header or sidebar to get started!";
  } else if (isAllArticlesView) {
    messageTitle = "No Articles Across All Feeds";
    messageBody =
      "There are currently no articles from any of your subscribed feeds. Perhaps add more feeds or check back later.";
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <BookOpenIcon className="w-20 h-20 text-muted-foreground dark:text-slate-600 mb-6" />
      <h2 className="text-xl font-semibold text-foreground dark:text-slate-300 mb-2">
        {messageTitle}
      </h2>
      <p className="text-muted-foreground dark:text-slate-400 max-w-sm">
        {messageBody}
      </p>
    </div>
  );
};
export const ArticleListEmptyState = React.memo(ArticleListEmptyStateComponent);
