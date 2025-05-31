import React, { useState } from 'react';
import { PlusIcon } from '../shared/icons/PlusIcon';
import { RssIcon } from '../shared/icons/RssIcon';
import type { Folder } from '../../types/entities';
import { Modal } from '../shared/components/Modal';
import { Button } from '../shared/ui/Button';
import { rssApiService } from '../../services/api';

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
  const [existingFeed, setExistingFeed] = useState<any | null>(null);

  const handleUrlBlur = async () => {
    if (!url.trim()) return;
    setIsFetchingName(true);
    setError(null);
    try {
      const title = await rssApiService.fetchFeedTitle(url);
      setFeedName(title || '');
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
    setExistingFeed(null);
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
    } catch (err: any) {
      let message = 'Failed to add feed. Please check the URL.';
      let existing = null;
      if (err && err.message) {
        try {
          const parsed = typeof err.message === 'string' ? JSON.parse(err.message) : err.message;
          if ((parsed && parsed.existingFeed) || (parsed && parsed.detail && parsed.detail.existingFeed)) {
            message = 'This feed source already exists!!.';
            existing = parsed.existingFeed || (parsed.detail && parsed.detail.existingFeed);
          } else if (
            (parsed && parsed.detail && typeof parsed.detail === 'string' &&
              parsed.detail.toLowerCase().includes('already exists'))
          ) {
            message = 'This feed source already exists!!.';
          } else if (
            typeof parsed === 'string' && parsed.toLowerCase().includes('already exists')
          ) {
            message = 'This feed source already exists!!.';
          } else {
            message = err.message;
          }
        } catch {
          if (err.message && err.message.toLowerCase().includes('already exists')) {
            message = 'This feed source already exists!!.';
          } else if (err.status === 400) {
            message = 'This feed source already exists!!.';
          } else {
            message = err.message;
          }
        }
      } else if (err && err.status === 400) {
        message = 'This feed source already exists!!.';
      }
      setError(message);
      setExistingFeed(existing);
      setIsLoading(false);
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
        form="add-feed-form"
        disabled={isLoading}
        variant="primary"
        size="md"
        isLoading={isLoading}
        leftIcon={!isLoading ? <PlusIcon className="w-4 h-4" /> : undefined}
      >
        {isLoading ? 'Adding...' : 'Add Feed'}
      </Button>
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
        
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 mt-3 text-center p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
            {error}
            {existingFeed && (
              <div className="mt-2">
                <span>This feed is already in your list.</span>
                <div className="mt-1">
                  <a
                    href={existingFeed.site_url || existingFeed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary-dark"
                  >
                    View existing feed: {existingFeed.title || existingFeed.url}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};
export const AddFeedModal = React.memo(AddFeedModalComponent);
