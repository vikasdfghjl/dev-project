
import React, { useState } from 'react';
import type { Feed, Folder } from '../types';
import { FeedItem } from './FeedItem';
import { FolderItemHeader } from './FolderItemHeader';
import { FolderItemActions } from './FolderItemActions';

interface FolderItemProps {
  folder: Folder;
  feeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (feedId: string) => void;
  onDeleteFeed: (feedId: string) => void;
  onEditFolder: () => void;
  onDeleteFolder: () => void;
  onMoveFeed: (feed: Feed) => void;
}

const FolderItemComponent: React.FC<FolderItemProps> = ({
  folder,
  feeds,
  selectedFeedId,
  onSelectFeed,
  onDeleteFeed,
  onEditFolder,
  onDeleteFolder,
  onMoveFeed
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <li className="my-0.5">
      {/* Fix: Pass FolderItemActions to the 'childrenActions' prop as expected by FolderItemHeaderProps */}
      <FolderItemHeader
        folder={folder}
        isOpen={isOpen}
        feedCount={feeds.length}
        onToggleOpen={() => setIsOpen(!isOpen)}
        childrenActions={
          <FolderItemActions 
              folderName={folder.name}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
          />
        }
      />
      {isOpen && (
        <ul id={`folder-content-${folder.id}`} className="pl-2 border-l-2 border-border dark:border-slate-700 ml-[26px] mb-1">
          {feeds.length > 0 ? (
            feeds.map((feed) => (
              <FeedItem
                key={feed.id}
                feed={feed}
                isSelected={feed.id === selectedFeedId}
                onSelect={() => onSelectFeed(feed.id)}
                onDelete={() => onDeleteFeed(feed.id)}
                onMove={() => onMoveFeed(feed)}
                isInFolderView={true}
              />
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-muted-foreground dark:text-slate-500 italic">
              No feeds in this folder.
            </li>
          )}
        </ul>
      )}
    </li>
  );
};
export const FolderItem = React.memo(FolderItemComponent);
