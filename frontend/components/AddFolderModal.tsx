
import React, { useState } from 'react';
import { FolderIcon } from './icons/FolderIcon';
import { PlusIcon } from './icons/PlusIcon';
import { Modal } from './Modal'; // Import the generic Modal

interface AddFolderModalProps {
  onClose: () => void;
  onAddFolder: (name: string) => Promise<void>;
}

const AddFolderModalComponent: React.FC<AddFolderModalProps> = ({ onClose, onAddFolder }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter a folder name.');
      return;
    }
    setIsLoading(true);
    try {
      await onAddFolder(name);
      // onClose will be called by parent on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add folder.');
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center">
        <FolderIcon className="w-7 h-7 mr-3 text-primary dark:text-primary-dark" />
        Create New Folder
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
        form="add-folder-form"
        disabled={isLoading}
        className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </>
        ) : (
          <>
            <PlusIcon className="w-4 h-4 mr-2" /> Create Folder
          </>
        )}
      </button>
    </>
  );


  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle as any} footerContent={footer}>
      <form onSubmit={handleSubmit} id="add-folder-form">
        <div className="mb-1">
          <label htmlFor="folderName" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            Folder Name
          </label>
          <input
            type="text"
            id="folderName"
            name="folderName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Tech Blogs, News Sites"
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
export const AddFolderModal = React.memo(AddFolderModalComponent);
