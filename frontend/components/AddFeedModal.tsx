import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { RssIcon } from './icons/RssIcon';
import type { Folder } from '../types';
import { Modal } from './Modal'; // Import the generic Modal

interface AddFeedModalProps {
  onClose: () => void;
  onAddFeed: (url: string, feedName: string, folderId?: string | null) => Promise<void>;
  folders: Folder[];
}

const AddFeedModalComponent: React.FC<AddFeedModalProps> = ({ onClose, onAddFeed, folders }) => {
  const [url, setUrl] = useState<string>('');
  const [feedName, setFeedName] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingName, setIsFetchingName] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlBlur = async () => {
    if (!url.trim()) return;
    setIsFetchingName(true);
    setError(null);
    try {
      // Try to fetch the feed title from backend utility endpoint
      const res = await fetch(`/api/v1/feeds/parse-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error('Could not fetch feed name.');
      const data = await res.json();
      setFeedName(data.title || '');
    } catch (err) {
      setFeedName('');
      setError('Could not fetch feed name. You can enter it manually.');
    } finally {
      setIsFetchingName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError('Please enter a valid RSS feed URL.');
      return;
    }
    if (!feedName.trim()) {
      setError('Feed name is required.');
      return;
    }
    setIsLoading(true);
    try {
      await onAddFeed(url, feedName, selectedFolderId);
      // onClose will be called by parent on success if submission is successful
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed. Please check the URL.');
      setIsLoading(false); // Keep modal open on error
    }
  };

  const modalTitle = (
    <div className="flex items-center">
        <RssIcon className="w-7 h-7 mr-3 text-primary dark:text-primary-dark" />
        Add New Feed
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
        form="add-feed-form" // Associate with the form
        disabled={isLoading}
        className="px-5 py-2.5 text-sm font-medium bg-primary hover:bg-primary-dark text-primary-foreground dark:bg-accent dark:hover:bg-primary-dark rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </>
        ) : (
          <>
            <PlusIcon className="w-4 h-4 mr-2" /> Add Feed
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle as any} footerContent={footer} size="lg">
      <form onSubmit={handleSubmit} id="add-feed-form">
        <div className="mb-4">
          <label htmlFor="feedUrl" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            RSS Feed URL
          </label>
          <input
            type="url"
            id="feedUrl"
            name="feedUrl"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="https://example.com/feed.xml"
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label htmlFor="feedName" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            Feed Name
          </label>
          <input
            type="text"
            id="feedName"
            name="feedName"
            value={feedName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedName(e.target.value)}
            placeholder="Feed name will be fetched or you can enter manually"
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
            required
            disabled={isFetchingName || isLoading}
          />
          {isFetchingName && <span className="text-xs text-muted-foreground ml-2">Fetching name...</span>}
        </div>

        <div className="mb-1"> {/* Reduced mb for error message placement */}
          <label htmlFor="folderSelect" className="block text-sm font-medium text-muted-foreground dark:text-slate-300 mb-1">
            Add to Folder (Optional)
          </label>
          <select
            id="folderSelect"
            value={selectedFolderId || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFolderId(e.target.value || null)}
            disabled={isLoading}
            className="w-full px-3 py-2.5 border border-border dark:border-slate-600 rounded-lg bg-background dark:bg-slate-700 text-foreground dark:text-slate-200 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark outline-none transition-shadow"
          >
            <option value="">No Folder</option>
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
export const AddFeedModal = React.memo(AddFeedModalComponent);
