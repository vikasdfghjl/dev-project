
import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon'; // Used for "Move" action

interface FeedItemActionsProps {
  feedTitle: string;
  onMove: () => void;
  onDelete: () => void;
  isSelected?: boolean; // To adjust opacity if needed
}

const FeedItemActionsComponent: React.FC<FeedItemActionsProps> = ({ feedTitle, onMove, onDelete, isSelected }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the feed "${feedTitle}"?`)) {
      onDelete();
    }
  };

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove();
  };

  return (
    <div className="flex items-center space-x-0.5 flex-shrink-0">
      <button
        onClick={handleMoveClick}
        className={`
          p-1.5 rounded text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark
          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-150
          focus:outline-none focus:ring-1 focus:ring-primary
          ${isSelected ? 'opacity-60 hover:opacity-100' : ''}
        `}
        aria-label={`Move feed ${feedTitle} to folder`}
        title="Move to folder"
      >
        <EditIcon className="h-4 w-4" />
      </button>
      <button
        onClick={handleDeleteClick}
        className={`
          p-1.5 rounded text-muted-foreground hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400
          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-150
          focus:outline-none focus:ring-1 focus:ring-red-500
          ${isSelected ? 'opacity-60 hover:opacity-100' : ''}
        `}
        aria-label={`Delete feed ${feedTitle}`}
        title="Delete feed"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
export const FeedItemActions = React.memo(FeedItemActionsComponent);
