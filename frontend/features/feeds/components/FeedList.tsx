
import React from 'react';
import type { Feed } from '../../../types';
import { FeedItem } from './FeedItem';

interface FeedListProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (feedId: string) => void;
  onDeleteFeed: (feedId: string) => void;
  // Fix: Add onMoveFeed prop to handle moving feeds
  onMoveFeed: (feed: Feed) => void;
}

export const FeedList: React.FC<FeedListProps> = ({ feeds, selectedFeedId, onSelectFeed, onDeleteFeed, onMoveFeed }) => {
  if (feeds.length === 0) {
    return null; // Or a message, handled by Sidebar
  }

  return (
    <nav className="py-2">
      <ul>
        {feeds.map((feed) => (
          <FeedItem
            key={feed.id}
            feed={feed}
            isSelected={feed.id === selectedFeedId}
            onSelect={() => onSelectFeed(feed.id)}
            onDelete={() => onDeleteFeed(feed.id)}
            // Fix: Pass the onMove prop, calling onMoveFeed with the current feed
            onMove={() => onMoveFeed(feed)}
          />
        ))}
      </ul>
    </nav>
  );
};
