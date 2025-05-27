
import React, { useState, useEffect } from 'react';
import type { Folder } from '../types';
import { EditIcon } from './icons/EditIcon';
import { Modal } from './Modal'; // Import the generic Modal

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
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="px-5 py-2.5 text-sm font-medium text-muted-foreground dark:text-slate-300 hover:bg-muted dark:hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="rename-folder-form"
        disabled={isLoading}
        className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Renaming...
          </>
        ) : (
          <>
            <EditIcon className="w-4 h-4 mr-2" /> Save Changes
          </>
        )}
      </button>
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
