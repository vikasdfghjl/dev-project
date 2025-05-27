import React, { useState, useEffect } from 'react';
import type { Feed, Folder } from '../types';
import { SettingsHeader } from './settings/SettingsHeader';
import { ManageFeedsSection } from './settings/ManageFeedsSection';
import { ManageFoldersSection } from './settings/ManageFoldersSection';

interface SettingsPageProps {
  feeds: Feed[];
  folders: Folder[];
  onCloseSettings: () => void;
  onAddFeedClick: () => void;
  onDeleteFeed: (feedId: string) => void;
  onMoveFeed: (feed: Feed) => void; // To trigger MoveFeedToFolderModal
  onAddFolderClick: () => void;
  onRenameFolder: (folder: Folder) => void; // To trigger RenameFolderModal
  onDeleteFolder: (folderId: string) => void;
}

const REFRESH_INTERVAL_OPTIONS = [
  { value: 5, label: 'Every 5 minutes' },
  { value: 10, label: 'Every 10 minutes' },
  { value: 15, label: 'Every 15 minutes' },
  { value: 30, label: 'Every 30 minutes' },
  { value: 60, label: 'Every 60 minutes' },
];

const SettingsPageComponent: React.FC<SettingsPageProps> = ({
  feeds,
  folders,
  onCloseSettings,
  onAddFeedClick,
  onDeleteFeed,
  onMoveFeed,
  onAddFolderClick,
  onRenameFolder,
  onDeleteFolder,
}) => {
  // Refresh interval state
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    const stored = localStorage.getItem('refreshIntervalMinutes');
    return stored ? parseInt(stored, 10) : 15;
  });

  useEffect(() => {
    localStorage.setItem('refreshIntervalMinutes', String(refreshInterval));
    // Optionally: notify parent/app of change
  }, [refreshInterval]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background dark:bg-slate-850">
      <SettingsHeader onCloseSettings={onCloseSettings} />
      <div className="max-w-4xl mx-auto space-y-8">
        <ManageFeedsSection
          feeds={feeds}
          folders={folders} // For the move modal
          onTriggerAddFeedModal={onAddFeedClick}
          onDeleteFeed={onDeleteFeed}
          onTriggerMoveFeedModal={onMoveFeed}
        />
        <ManageFoldersSection
          folders={folders}
          onTriggerAddFolderModal={onAddFolderClick}
          onDeleteFolder={onDeleteFolder}
          onTriggerRenameFolderModal={onRenameFolder}
        />
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Feed Refresh Interval</h3>
          <label htmlFor="refresh-interval-select" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            How often should feeds be refreshed automatically?
          </label>
          <select
            id="refresh-interval-select"
            value={refreshInterval}
            onChange={e => setRefreshInterval(Number(e.target.value))}
            className="w-full max-w-xs px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow mb-2"
          >
            {REFRESH_INTERVAL_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
            The app will check for new articles at this interval in the background.
          </p>
        </section>
      </div>
    </div>
  );
};
export const SettingsPage = React.memo(SettingsPageComponent);
