
import React from 'react';
import type { Feed } from '../../../types';
import { FeedItemInfo } from './FeedItemInfo';
import { FeedItemActions } from './FeedItemActions';

interface FeedItemProps {
  feed: Feed;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onMove: () => void;
  isInFolderView?: boolean;
}

const FeedItemComponent: React.FC<FeedItemProps> = ({ 
  feed, 
  isSelected, 
  onSelect, 
  onDelete, 
  onMove, 
  isInFolderView = false 
}) => {
  return (
    <li className={`group ${isInFolderView ? 'pl-5 pr-1' : 'px-2'}`}>
      <div
        onClick={onSelect}
        className={`
          flex items-center justify-between w-full px-3 py-2 my-0.5 rounded-md cursor-pointer transition-all duration-150 ease-in-out
          text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-800
          ${isSelected 
            ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark' 
            : 'text-muted-foreground hover:bg-muted dark:text-slate-300 dark:hover:bg-slate-700/60'}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        aria-selected={isSelected}
      >
        <FeedItemInfo feed={feed} />
        <FeedItemActions 
          feedTitle={feed.title}
          onMove={onMove}
          onDelete={onDelete}
          isSelected={isSelected}
        />
      </div>
    </li>
  );
};
export const FeedItem = React.memo(FeedItemComponent);
