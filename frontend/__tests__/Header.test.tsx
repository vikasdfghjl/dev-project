import { Header } from '../features/layout/Header';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  it('renders without crashing', () => {
    render(
      <Header
        onAddFeedClick={() => {}}
        onRefreshFeeds={async () => {}}
      />
    );
    expect(true).toBe(true);
  });
});
