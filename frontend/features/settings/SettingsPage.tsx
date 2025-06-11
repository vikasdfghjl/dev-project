import React, { useState, useEffect } from "react";
import type { Feed, Folder, AppSettings, SettingsUpdate } from "../../types";
import {
  SettingsHeader,
  ManageFeedsSection,
  ManageFoldersSection,
  ArticleCleanupSection,
  AutoCleanupSettingsSection,
} from "./components";
import { rssService } from "../../services";

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
  // Settings state
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);
  const [settingsError, setSettingsError] = useState<string>("");

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const appSettings = await rssService.getSettings();
        setSettings(appSettings);
      } catch (err: any) {
        setSettingsError(err.message || "Failed to load settings");
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateSettings = async (settingsUpdate: SettingsUpdate) => {
    try {
      const updatedSettings = await rssService.updateSettings(settingsUpdate);
      setSettings(updatedSettings);
      setSettingsError("");
    } catch (err: any) {
      setSettingsError(err.message || "Failed to update settings");
      throw err; // Re-throw so components can handle their own error states
    }
  };

  const handleArticleCleanup = async (days: number) => {
    await rssService.cleanupOldArticles(days);
  };

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

        <ArticleCleanupSection onCleanup={handleArticleCleanup} />

        {/* Auto Cleanup Settings */}
        {isLoadingSettings ? (
          <div className="bg-card dark:bg-slate-800 rounded-lg shadow-sm border border-border dark:border-slate-700 p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">
                Loading settings...
              </span>
            </div>
          </div>
        ) : settingsError ? (
          <div className="bg-card dark:bg-slate-800 rounded-lg shadow-sm border border-border dark:border-slate-700 p-6">
            <div className="text-red-600 dark:text-red-400 text-center py-8">
              Error: {settingsError}
            </div>
          </div>
        ) : settings ? (
          <AutoCleanupSettingsSection
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        ) : null}
      </div>
    </div>
  );
};
export const SettingsPage = React.memo(SettingsPageComponent);
