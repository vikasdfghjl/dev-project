
import React from 'react';
import type { Feed } from '../../../../types';
import { RssIcon } from '../../../shared/icons/RssIcon';
import { EditIcon } from '../../../shared/icons/EditIcon';
import { TrashIcon } from '../../../shared/icons/TrashIcon';

interface SettingsFeedListItemProps {
  feed: Feed;
  onDelete: () => void;
  onMove: () => void;
}

const SettingsFeedListItemComponent: React.FC<SettingsFeedListItemProps> = ({ feed, onDelete, onMove }) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const imgElement = e.currentTarget;
        imgElement.style.display = 'none'; // Hide broken image
        const fallbackIcon = imgElement.nextElementSibling; // Assuming RssIcon is the next sibling
        if (fallbackIcon) {
            fallbackIcon.classList.remove('hidden');
        }
    };
  return (
    <li className="flex items-center justify-between p-3 bg-muted/50 dark:bg-slate-700/30 rounded-md hover:bg-muted dark:hover:bg-slate-700/60 transition-colors">
      <div className="flex items-center min-w-0 mr-4">
        {feed.favicon ? (
            <>
                <img
                    src={feed.favicon}
                    alt=""
                    className="h-6 w-6 mr-3 rounded-sm flex-shrink-0 object-contain"
                    onError={handleImageError}
                />
                <RssIcon className="h-6 w-6 mr-3 text-slate-400 dark:text-slate-500 flex-shrink-0 hidden" />
            </>
        ) : (
            <RssIcon className="h-6 w-6 mr-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground dark:text-slate-200 truncate" title={feed.title}>
            {feed.title}
          </p>
          <p className="text-xs text-muted-foreground dark:text-slate-400 truncate" title={feed.url}>
            {feed.url}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onMove}
          className="p-1.5 rounded text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
          title="Move to folder"
          aria-label={`Move feed ${feed.title}`}
        >
          <EditIcon className="h-4 w-4" /> {/* Placeholder, consider a folder-move icon */}
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-muted-foreground hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          title="Delete feed"
          aria-label={`Delete feed ${feed.title}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};
export const SettingsFeedListItem = React.memo(SettingsFeedListItemComponent);
