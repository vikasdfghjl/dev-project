import React from "react";
import { EditIcon } from "../../shared/icons/EditIcon";
import { TrashIcon } from "../../shared/icons/TrashIcon";
import { Button } from "../../shared/ui/Button";

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
      <Button
        onClick={e => {
          e.stopPropagation();
          onEditFolder();
        }}
        variant="ghost"
        size="sm"
        className="p-1.5"
        aria-label={`Rename folder ${folderName}`}
        title="Rename folder"
        leftIcon={<EditIcon className="h-4 w-4" />}
      />
      <Button
        onClick={e => {
          e.stopPropagation();
          onDeleteFolder();
        }}
        variant="ghost"
        size="sm"
        className="p-1.5 hover:text-red-600 dark:hover:text-red-400"
        aria-label={`Delete folder ${folderName}`}
        title="Delete folder"
        leftIcon={<TrashIcon className="h-4 w-4" />}
      />
    </>
  );
};
export const FolderItemActions = React.memo(FolderItemActionsComponent);
