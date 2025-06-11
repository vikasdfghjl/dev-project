import React from "react";
import type { Feed, Folder } from "../../types/entities";
import { FolderItem } from "../folders/components/FolderItem";
import { FeedItem } from "../feeds/components/FeedItem";
import { LoadingSpinner } from "../shared/components/LoadingSpinner";
import { BookOpenIcon } from "../shared/icons/BookOpenIcon";
import { ALL_ARTICLES_VIEW_ID } from "../../constants";

import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNavItem } from "./components/SidebarNavItem";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarEmptyState } from "./components/SidebarEmptyState";

interface SidebarProps {
  folders: Folder[];
  feedsByFolder: { [folderId: string]: Feed[] };
  ungroupedFeeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (feedId: string | null) => void;
  onDeleteFeed: (feedId: string) => void;
  isLoading: boolean;
  onAddFeedClick: () => void;
  onAddFolderClick: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveFeed: (feed: Feed) => void;
  onOpenSettingsClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  folders,
  feedsByFolder,
  ungroupedFeeds,
  selectedFeedId,
  onSelectFeed,
  onDeleteFeed,
  isLoading,
  onAddFeedClick,
  onAddFolderClick,
  onEditFolder,
  onDeleteFolder,
  onMoveFeed,
  onOpenSettingsClick,
  isCollapsed,
  onToggleCollapse,
}) => {
  const sidebarWidthClass = isCollapsed ? "w-20" : "w-64 md:w-72";

  return (
    <aside
      className={`${sidebarWidthClass} bg-card dark:bg-slate-800 border-r border-border dark:border-slate-700 flex flex-col shadow-md transition-all duration-300 ease-in-out`}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        onAddFolderClick={onAddFolderClick}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <LoadingSpinner />
          {!isCollapsed && (
            <span className="ml-2 text-muted-foreground dark:text-slate-400">
              Loading...
            </span>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
          <ul>
            <SidebarNavItem
              label="All Articles"
              icon={<BookOpenIcon />}
              isSelected={selectedFeedId === ALL_ARTICLES_VIEW_ID}
              onClick={() => onSelectFeed(ALL_ARTICLES_VIEW_ID)}
              isCollapsed={isCollapsed}
              title="All Articles"
            />

            {!isCollapsed &&
              (folders.length > 0 || ungroupedFeeds.length > 0) && (
                <li className="px-3 my-2">
                  <hr className="border-border dark:border-slate-700/60" />
                </li>
              )}
          </ul>

          {!isCollapsed &&
            folders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                feeds={feedsByFolder[folder.id] || []}
                selectedFeedId={selectedFeedId}
                onSelectFeed={onSelectFeed}
                onDeleteFeed={onDeleteFeed}
                onEditFolder={() => onEditFolder(folder)}
                onDeleteFolder={() => onDeleteFolder(folder.id)}
                onMoveFeed={onMoveFeed}
              />
            ))}

          {!isCollapsed && ungroupedFeeds.length > 0 && (
            <div
              className={`mt-1 ${
                folders.length > 0
                  ? "pt-1 border-t border-border dark:border-slate-700/50"
                  : ""
              }`}
            >
              {folders.length > 0 && (
                <h3 className="px-4 py-1 text-xs font-semibold text-muted-foreground dark:text-slate-500 uppercase tracking-wider">
                  Uncategorized
                </h3>
              )}
              <ul>
                {ungroupedFeeds.map(feed => (
                  <FeedItem
                    key={feed.id}
                    feed={feed}
                    isSelected={feed.id === selectedFeedId}
                    onSelect={() => onSelectFeed(feed.id)}
                    onDelete={() => onDeleteFeed(feed.id)}
                    onMove={() => onMoveFeed(feed)}
                    isInFolderView={false}
                  />
                ))}
              </ul>
            </div>
          )}

          {!isCollapsed &&
            folders.length === 0 &&
            ungroupedFeeds.length === 0 &&
            !isLoading && (
              <SidebarEmptyState
                onAddFeedClick={onAddFeedClick}
                onAddFolderClick={onAddFolderClick}
              />
            )}
        </div>
      )}
      <SidebarFooter
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        onAddFeedClick={onAddFeedClick}
        onOpenSettingsClick={onOpenSettingsClick}
      />
    </aside>
  );
};
export const Sidebar = React.memo(SidebarComponent);
