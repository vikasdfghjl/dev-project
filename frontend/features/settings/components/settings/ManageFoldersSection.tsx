import React from 'react';
import type { Folder } from '../../../../types/entities';
import { SettingsSection } from './SettingsSection';
import { SettingsFolderListItem } from './SettingsFolderListItem';
import { FolderIcon as AddFolderIcon } from '../../../shared/icons/FolderIcon';
import { Button } from '../../../shared/ui/Button';

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
    <Button
      onClick={onTriggerAddFolderModal}
      variant="primary"
      size="sm"
      leftIcon={<AddFolderIcon className="w-4 h-4" />}
    >
      Add Folder
    </Button>
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
