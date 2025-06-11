import React from "react";
import { PlusIcon, FolderIcon } from "../../shared";

interface SidebarEmptyStateProps {
  onAddFeedClick: () => void;
  onAddFolderClick: () => void;
}

const SidebarEmptyStateComponent: React.FC<SidebarEmptyStateProps> = ({
  onAddFeedClick,
  onAddFolderClick,
}) => {
  return (
    <div className="p-4 text-center text-muted-foreground dark:text-slate-400">
      <p className="mb-2">No feeds or folders yet.</p>
      <button
        onClick={onAddFeedClick}
        className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center justify-center mx-auto mb-2 focus:outline-none focus:ring-1 focus:ring-primary rounded"
      >
        <PlusIcon className="w-4 h-4 mr-1" /> Add your first feed
      </button>
      <button
        onClick={onAddFolderClick}
        className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center justify-center mx-auto focus:outline-none focus:ring-1 focus:ring-primary rounded"
      >
        <FolderIcon className="w-4 h-4 mr-1" /> Create a folder
      </button>
    </div>
  );
};
export const SidebarEmptyState = React.memo(SidebarEmptyStateComponent);
