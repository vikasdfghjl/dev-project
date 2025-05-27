
import React from 'react';
import type { Feed, Folder } from '../../types';
import { SettingsSection } from './SettingsSection';
import { SettingsFeedListItem } from './SettingsFeedListItem';
import { PlusIcon } from '../icons/PlusIcon';

interface ManageFeedsSectionProps {
  feeds: Feed[];
  folders: Folder[]; // Needed for the "Move Feed" modal logic, passed through
  onTriggerAddFeedModal: () => void;
  onDeleteFeed: (feedId: string) => void;
  onTriggerMoveFeedModal: (feed: Feed) => void;
}

const ManageFeedsSectionComponent: React.FC<ManageFeedsSectionProps> = ({
  feeds,
  folders,
  onTriggerAddFeedModal,
  onDeleteFeed,
  onTriggerMoveFeedModal,
}) => {
  const actionButton = (
    <button
      onClick={onTriggerAddFeedModal}
      className="flex items-center bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark font-medium py-2 px-3 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
    >
      <PlusIcon className="w-4 h-4 mr-1.5" />
      Add Feed
    </button>
  );

  return (
    <SettingsSection 
        title="Manage Feeds" 
        actionButton={actionButton}
        itemCount={feeds.length}
        emptyStateMessage="No feeds added yet. Click 'Add Feed' to get started."
    >
      {feeds.map((feed) => (
        <SettingsFeedListItem
          key={feed.id}
          feed={feed}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete the feed "${feed.title}"?`)) {
                onDeleteFeed(feed.id);
            }
          }}
          onMove={() => onTriggerMoveFeedModal(feed)}
        />
      ))}
    </SettingsSection>
  );
};
export const ManageFeedsSection = React.memo(ManageFeedsSectionComponent);
