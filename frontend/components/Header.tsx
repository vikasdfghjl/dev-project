import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { RssIcon } from './icons/RssIcon';

interface HeaderProps {
  onAddFeedClick: () => void;
  onRefreshFeeds: () => Promise<void>;
}

const HeaderComponent: React.FC<HeaderProps> = ({ onAddFeedClick, onRefreshFeeds }) => {
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
          <h1 className="text-2xl font-bold text-foreground dark:text-slate-100">RSS Aggregator Pro</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-medium text-foreground dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center gap-2"
            title="Refresh feeds"
          >
            {isRefreshing ? (
              <svg
                className="animate-spin h-4 w-4 mr-1 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span className="material-icons mr-1">refresh</span>
            )}
            Refresh
          </button>
          <button
            onClick={onAddFeedClick}
            className="flex items-center bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark font-medium py-2 px-4 rounded-lg transition-colors duration-150 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
            aria-label="Add new feed"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Feed
          </button>
        </div>
      </div>
    </header>
  );
};
export const Header = React.memo(HeaderComponent);
