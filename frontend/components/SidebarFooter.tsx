
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { GearIcon } from './icons/GearIcon';
import { ChevronDoubleLeftIcon } from './icons/ChevronDoubleLeftIcon';
import { ChevronDoubleRightIcon } from './icons/ChevronDoubleRightIcon';

interface SidebarFooterProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddFeedClick: () => void;
  onOpenSettingsClick: () => void;
}

const SidebarFooterComponent: React.FC<SidebarFooterProps> = ({
  isCollapsed,
  onToggleCollapse,
  onAddFeedClick,
  onOpenSettingsClick,
}) => {
  return (
    <div className={`p-3 border-t border-border dark:border-slate-700 mt-auto flex items-center space-x-2 ${isCollapsed ? 'flex-col space-y-2 space-x-0' : ''}`}>
      <button
        onClick={onToggleCollapse}
        className={`p-2.5 text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark bg-muted dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 rounded-lg transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800 ${isCollapsed ? 'w-full flex justify-center' : ''}`}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
      </button>
      <button
        onClick={onAddFeedClick}
        className={`flex-1 flex items-center justify-center bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark font-medium py-2.5 px-3 rounded-lg transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800 ${isCollapsed ? 'w-full' : ''}`}
        aria-label="Add new feed"
        title={isCollapsed ? "Add new feed" : undefined}
      >
        <PlusIcon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
        {!isCollapsed && <span>Add Feed</span>}
      </button>
      <button
          onClick={onOpenSettingsClick}
          className={`p-2.5 text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark bg-muted dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 rounded-lg transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800 ${isCollapsed ? 'w-full flex justify-center' : ''}`}
          title="Settings"
          aria-label="Open settings for feeds and folders"
        >
          <GearIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
export const SidebarFooter = React.memo(SidebarFooterComponent);
