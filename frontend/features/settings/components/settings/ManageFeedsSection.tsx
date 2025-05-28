import React from 'react';
import type { Feed, Folder } from '../../../../types/entities';
import { SettingsSection } from './SettingsSection';
import { SettingsFeedListItem } from './SettingsFeedListItem';
import { PlusIcon } from '../../../shared/icons/PlusIcon';
import { Button } from '../../../shared/ui/Button';

interface ManageFeedsSectionProps {
  feeds: Feed[];
  folders: Folder[]; // Needed for the "Move Feed" modal logic, passed through
  onTriggerAddFeedModal: () => void;
  onDeleteFeed: (feedId: string) => void;
  onTriggerMoveFeedModal: (feed: Feed) => void;
}

const ManageFeedsSectionComponent: React.FC<ManageFeedsSectionProps> = ({
  feeds,
  folders, // eslint-disable-line @typescript-eslint/no-unused-vars -- needed for modal logic
  onTriggerAddFeedModal,
  onDeleteFeed,
  onTriggerMoveFeedModal,
}) => {
  const actionButton = (
    <Button
      onClick={onTriggerAddFeedModal}
      variant="primary"
      size="sm"
      leftIcon={<PlusIcon className="w-4 h-4" />}
    >
      Add Feed
    </Button>
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
