import { Sidebar } from '../features/layout/Sidebar';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(
      <Sidebar
        folders={[]}
        feedsByFolder={{}}
        ungroupedFeeds={[]}
        selectedFeedId={null}
        onSelectFeed={() => {}}
        onDeleteFeed={() => {}}
        isLoading={false}
        onAddFeedClick={() => {}}
        onAddFolderClick={() => {}}
        onEditFolder={() => {}}
        onDeleteFolder={() => {}}
        onMoveFeed={() => {}}
        onOpenSettingsClick={() => {}}
        isCollapsed={false}
        onToggleCollapse={() => {}}
      />
    );
    expect(true).toBe(true);
  });
});
