
import React from 'react';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FolderItemActionsProps {
  folderName: string;
  onEditFolder: () => void;
  onDeleteFolder: () => void;
}

const FolderItemActionsComponent: React.FC<FolderItemActionsProps> = ({
  folderName,
  onEditFolder,
  onDeleteFolder,
}) => {
  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); onEditFolder(); }}
        className="p-1.5 rounded text-muted-foreground hover:text-primary dark:text-slate-400 dark:hover:text-primary-dark focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label={`Rename folder ${folderName}`}
        title="Rename folder"
      >
        <EditIcon className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteFolder(); }}
        className="p-1.5 rounded text-muted-foreground hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-red-500"
        aria-label={`Delete folder ${folderName}`}
        title="Delete folder"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </>
  );
};
export const FolderItemActions = React.memo(FolderItemActionsComponent);
