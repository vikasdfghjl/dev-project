import React, { useState } from "react";
import { PlusIcon, RssIcon, RefreshIcon, BookIcon, Button } from "../shared";

interface HeaderProps {
  onAddFeedClick: () => void;
  onRefreshFeeds: () => Promise<void>;
  onOpenDocsClick: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  onAddFeedClick,
  onRefreshFeeds,
  onOpenDocsClick,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshFeeds();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="bg-card dark:bg-slate-800 border-b border-border dark:border-slate-700 p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <RssIcon className="h-8 w-8 text-primary dark:text-primary-dark" />
          <h1 className="text-2xl font-bold text-foreground dark:text-slate-100">
            RSS Aggregator Pro
          </h1>
        </div>{" "}
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenDocsClick}
            variant="ghost"
            size="md"
            title="Documentation"
            leftIcon={<BookIcon className="h-5 w-5" />}
            aria-label="Open FluxReader documentation"
          >
            Docs
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="secondary"
            size="md"
            isLoading={isRefreshing}
            title="Refresh feeds"
            leftIcon={
              !isRefreshing ? <RefreshIcon className="h-5 w-5" /> : undefined
            }
          >
            Refresh
          </Button>
          <Button
            onClick={onAddFeedClick}
            variant="primary"
            size="md"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            aria-label="Add new feed"
          >
            Add Feed
          </Button>
        </div>
      </div>
    </header>
  );
};
export const Header = React.memo(HeaderComponent);
