
import React from 'react';
import type { Folder } from '../../types';
import { FolderIcon } from '../icons/FolderIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface SettingsFolderListItemProps {
  folder: Folder;
  onDelete: () => void;
  onRename: () => void;
}

const SettingsFolderListItemComponent: React.FC<SettingsFolderListItemProps> = ({ folder, onDelete, onRename }) => {
  return (
    <li className="flex items-center justify-between p-3 bg-muted/50 dark:bg-slate-700/30 rounded-md hover:bg-muted dark:hover:bg-slate-700/60 transition-colors">
      <div className="flex items-center min-w-0 mr-4">
        <FolderIcon className="h-5 w-5 mr-3 text-primary dark:text-primary-dark flex-shrink-0" />
        <p className="text-sm font-medium text-foreground dark:text-slate-200 truncate" title={folder.name}>
          {folder.name}
        </p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={onRename}
          className="p-1.5 rounded text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark focus:outline-none focus:ring-1 focus:ring-primary"
          title="Rename folder"
          aria-label={`Rename folder ${folder.name}`}
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded text-muted-foreground hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          title="Delete folder"
          aria-label={`Delete folder ${folder.name}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};
export const SettingsFolderListItem = React.memo(SettingsFolderListItemComponent);
