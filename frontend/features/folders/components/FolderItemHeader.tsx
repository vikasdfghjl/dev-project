import React from "react";
import type { Folder } from "../../../types";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "../../shared";

interface FolderItemHeaderProps {
  folder: Folder;
  isOpen: boolean;
  feedCount: number;
  onToggleOpen: () => void;
  childrenActions?: React.ReactNode; // For action buttons
}

const FolderItemHeaderComponent: React.FC<FolderItemHeaderProps> = ({
  folder,
  isOpen,
  feedCount,
  onToggleOpen,
  childrenActions,
}) => {
  return (
    <div
      className="flex items-center justify-between mx-2 px-3 py-2.5 rounded-md hover:bg-muted dark:hover:bg-slate-700/50 cursor-pointer group focus-within:bg-muted dark:focus-within:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-800"
      onClick={onToggleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onToggleOpen()}
      aria-expanded={isOpen}
      aria-controls={`folder-content-${folder.id}`}
    >
      <div className="flex items-center text-foreground dark:text-slate-200 min-w-0">
        {isOpen ? (
          <ChevronDownIcon className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground dark:text-slate-400" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground dark:text-slate-400" />
        )}
        <FolderIcon className="h-5 w-5 mr-2 text-primary dark:text-primary-dark flex-shrink-0" />
        <span className="font-medium text-sm truncate" title={folder.name}>
          {folder.name}
        </span>
        <span className="ml-2 text-xs text-muted-foreground dark:text-slate-400">
          ({feedCount})
        </span>
      </div>
      {childrenActions && (
        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          {childrenActions}
        </div>
      )}
    </div>
  );
};
export const FolderItemHeader = React.memo(FolderItemHeaderComponent);
