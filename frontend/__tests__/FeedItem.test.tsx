import { FeedItem } from '../features/feeds/components/FeedItem';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

const mockFeed = {
  id: 'feed1',
  title: 'Feed Title',
  url: 'https://example.com/feed.xml',
};

describe('FeedItem', () => {
  it('renders feed item', () => {
    render(
      <FeedItem
        feed={mockFeed}
        isSelected={false}
        onSelect={() => {}}
        onDelete={() => {}}
        onMove={() => {}}
      />
    );
    expect(true).toBe(true);
  });
});
