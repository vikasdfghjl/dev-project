import React, { useState } from 'react';
import type { Feed, Folder } from '../../types/entities';
import { EditIcon } from '../shared/icons/EditIcon';
import { Modal } from '../shared/components/Modal';
import { Button } from '../shared/ui/Button';

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
        form="move-feed-form"
        disabled={isLoading}
        variant="primary"
        size="md"
        isLoading={isLoading}
      >
        {isLoading ? 'Moving...' : 'Move Feed'}
      </Button>
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
