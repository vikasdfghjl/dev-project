
import React from 'react';
import { FolderIcon } from '../../shared/icons/FolderIcon';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onAddFolderClick: () => void;
}

const SidebarHeaderComponent: React.FC<SidebarHeaderProps> = ({ isCollapsed, onAddFolderClick }) => {
  return (
    <div className={`p-4 border-b border-border dark:border-slate-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      {!isCollapsed && <h2 className="text-lg font-semibold text-foreground dark:text-slate-200">My Feeds</h2>}
      <button
        onClick={onAddFolderClick}
        className={`p-1.5 text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-800 ${isCollapsed && 'mx-auto'}`}
        title="Add new folder"
        aria-label="Add new folder"
      >
        <FolderIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
export const SidebarHeader = React.memo(SidebarHeaderComponent);
