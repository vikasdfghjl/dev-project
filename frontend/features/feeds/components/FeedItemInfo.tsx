import React from 'react';
import type { Feed } from '../../../types';
import { RssIcon } from '../../shared/icons/RssIcon';

interface FeedItemInfoProps {
  feed: Feed;
}

const FeedItemInfoComponent: React.FC<FeedItemInfoProps> = ({ feed }) => {
  // Simplified onError handler: hides image on error and shows fallback icon.
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.style.display = 'none';
    const fallbackIcon = img.nextElementSibling as HTMLElement | null;
    if (fallbackIcon) fallbackIcon.classList.remove('hidden');
  };

  return (
    <div className="flex items-center min-w-0">
      {feed.favicon ? (
        <>
          <img
            src={feed.favicon}
            alt="" // Decorative, alt is handled by title
            className="h-5 w-5 mr-2.5 rounded-sm flex-shrink-0 object-contain"
            onError={handleImageError}
          />
          {/* Fallback icon initially hidden, shown if image fails */}
          <RssIcon className="h-5 w-5 mr-2.5 text-slate-400 dark:text-slate-500 flex-shrink-0 hidden" />
        </>
      ) : (
        <RssIcon className="h-5 w-5 mr-2.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
      )}
      <span className="truncate" title={feed.title}>{feed.title}</span>
    </div>
  );
};
export const FeedItemInfo = React.memo(FeedItemInfoComponent);
