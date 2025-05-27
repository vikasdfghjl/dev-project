
import React, { useState } from 'react';
import type { Feed, Folder } from '../types';
import { EditIcon } from './icons/EditIcon'; // Consider a more specific icon like FolderArrowIcon
import { Modal } from './Modal'; // Import the generic Modal

interface MoveFeedToFolderModalProps {
  feed: Feed;
  folders: Folder[];
  onClose: () => void;
  onMoveFeed: (feedId: string, targetFolderId: string | null) => Promise<void>;
}

const MoveFeedToFolderModalComponent: React.FC<MoveFeedToFolderModalProps> = ({ feed, folders, onClose, onMoveFeed }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(feed.folderId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (selectedFolderId === (feed.folderId || null)) {
        onClose(); // No change, just close
        return;
    }

    setIsLoading(true);
    try {
      await onMoveFeed(feed.id, selectedFolderId);
      // Parent will close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move feed.');
      setIsLoading(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center">
        <EditIcon className="w-7 h-7 mr-3 text-primary dark:text-primary-dark" /> {/* Placeholder icon */}
        Move Feed
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
        form="move-feed-form"
        disabled={isLoading}
        className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Moving...
          </>
        ) : (
          <>
            Move Feed
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle as any} footerContent={footer}>
      <form onSubmit={handleSubmit} id="move-feed-form">
        <p className="mb-2 text-sm text-muted-foreground dark:text-slate-300">
          Move feed: <strong className="text-foreground dark:text-slate-100">{feed.title}</strong>
        </p>
        <div className="mb-1">
          <label htmlFor="targetFolderSelect" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            To Folder:
          </label>
          <select
            id="targetFolderSelect"
            value={selectedFolderId || ''}
            onChange={(e) => setSelectedFolderId(e.target.value || null)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
            autoFocus
          >
            <option value="">No Folder (Root)</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center p-2 bg-red-50 dark:bg-red-900/30 rounded-md">{error}</p>}
      </form>
    </Modal>
  );
};
export const MoveFeedToFolderModal = React.memo(MoveFeedToFolderModalComponent);
