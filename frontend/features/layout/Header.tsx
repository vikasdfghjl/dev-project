import React, { useState } from "react";
import { PlusIcon, RssIcon, RefreshIcon, Button } from "../shared";

// Inline document icon to avoid Docker build issues
const DocsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

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
            leftIcon={<DocsIcon className="h-5 w-5" />}
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
