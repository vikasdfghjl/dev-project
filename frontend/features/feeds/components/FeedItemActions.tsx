import React from "react";
import { TrashIcon } from "../../shared/icons/TrashIcon";
import { EditIcon } from "../../shared/icons/EditIcon";
import { Button } from "../../shared/ui/Button";

interface FeedItemActionsProps {
  feedTitle: string;
  onMove: () => void;
  onDelete: () => void;
  isSelected?: boolean; // To adjust opacity if needed
}

const FeedItemActionsComponent: React.FC<FeedItemActionsProps> = ({
  feedTitle,
  onMove,
  onDelete,
  isSelected,
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete the feed "${feedTitle}"?`)
    ) {
      onDelete();
    }
  };

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove();
  };

  return (
    <div className="flex items-center space-x-0.5 flex-shrink-0">
      <Button
        onClick={handleMoveClick}
        variant="ghost"
        size="sm"
        className={`
          p-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-150
          ${isSelected ? "opacity-60 hover:opacity-100" : ""}
        `}
        aria-label={`Move feed ${feedTitle} to folder`}
        title="Move to folder"
        leftIcon={<EditIcon className="h-4 w-4" />}
      />
      <Button
        onClick={handleDeleteClick}
        variant="ghost"
        size="sm"
        className={`
          p-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity duration-150
          hover:text-red-600 dark:hover:text-red-400
          ${isSelected ? "opacity-60 hover:opacity-100" : ""}
        `}
        aria-label={`Delete feed ${feedTitle}`}
        title="Delete feed"
        leftIcon={<TrashIcon className="h-4 w-4" />}
      />
    </div>
  );
};
export const FeedItemActions = React.memo(FeedItemActionsComponent);
