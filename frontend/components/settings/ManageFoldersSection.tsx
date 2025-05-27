
import React from 'react';
import type { Folder } from '../../types';
import { SettingsSection } from './SettingsSection';
import { SettingsFolderListItem } from './SettingsFolderListItem';
import { FolderIcon as AddFolderIcon } from '../icons/FolderIcon'; // Alias for clarity

interface ManageFoldersSectionProps {
  folders: Folder[];
  onTriggerAddFolderModal: () => void;
  onDeleteFolder: (folderId: string) => void;
  onTriggerRenameFolderModal: (folder: Folder) => void;
}

const ManageFoldersSectionComponent: React.FC<ManageFoldersSectionProps> = ({
  folders,
  onTriggerAddFolderModal,
  onDeleteFolder,
  onTriggerRenameFolderModal,
}) => {
  const actionButton = (
    <button
      onClick={onTriggerAddFolderModal}
      className="flex items-center bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark font-medium py-2 px-3 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
    >
      <AddFolderIcon className="w-4 h-4 mr-1.5" />
      Add Folder
    </button>
  );

  return (
    <SettingsSection 
        title="Manage Folders" 
        actionButton={actionButton}
        itemCount={folders.length}
        emptyStateMessage="No folders created yet. Click 'Add Folder' to organize your feeds."
    >
      {folders.map((folder) => (
        <SettingsFolderListItem
          key={folder.id}
          folder={folder}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"? Feeds inside will be moved to the root.`)) {
              onDeleteFolder(folder.id);
            }
          }}
          onRename={() => onTriggerRenameFolderModal(folder)}
        />
      ))}
    </SettingsSection>
  );
};
export const ManageFoldersSection = React.memo(ManageFoldersSectionComponent);
