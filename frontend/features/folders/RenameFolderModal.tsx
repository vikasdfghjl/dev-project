import React, { useState, useEffect } from 'react';
import type { Folder } from '../../types';
import { EditIcon } from '../shared/icons/EditIcon';
import { Modal } from '../shared/components/Modal';
import { Button } from '../shared/ui/Button';

interface RenameFolderModalProps {
  folder: Folder;
  onClose: () => void;
  onRenameFolder: (folderId: string, newName: string) => Promise<void>;
}

const RenameFolderModalComponent: React.FC<RenameFolderModalProps> = ({ folder, onClose, onRenameFolder }) => {
  const [newName, setNewName] = useState(folder.name);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewName(folder.name);
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) {
      setError('Please enter a folder name.');
      return;
    }
    if (newName.trim() === folder.name) {
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      await onRenameFolder(folder.id, newName.trim());
      // Parent will close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename folder.');
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center">
        <EditIcon className="w-7 h-7 mr-3 text-primary dark:text-primary-dark" />
        Rename Folder
    </div>
  );
  
  const footer = (
    <>
      <Button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        variant="ghost"
        size="md"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="rename-folder-form"
        disabled={isLoading}
        variant="primary"
        size="md"
        isLoading={isLoading}
        leftIcon={!isLoading ? <EditIcon className="w-4 h-4" /> : undefined}
      >
        {isLoading ? 'Renaming...' : 'Save Changes'}
      </Button>
    </>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle as any} footerContent={footer}>
      <form onSubmit={handleSubmit} id="rename-folder-form">
        <div className="mb-1">
          <label htmlFor="newFolderName" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            New Folder Name
          </label>
          <input
            type="text"
            id="newFolderName"
            name="newFolderName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center p-2 bg-red-50 dark:bg-red-900/30 rounded-md">{error}</p>}
      </form>
    </Modal>
  );
};
export const RenameFolderModal = React.memo(RenameFolderModalComponent);
