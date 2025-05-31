import { FeedItemActions } from '../features/feeds/components/FeedItemActions';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('FeedItemActions', () => {
  it('renders without crashing', () => {
    render(
      <FeedItemActions
        feedTitle="Test Feed"
        onMove={() => {}}
        onDelete={() => {}}
        isSelected={false}
      />
    );
    expect(true).toBe(true);
  });
});
