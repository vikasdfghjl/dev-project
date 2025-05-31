import { ArticleList } from '../features/articles/ArticleList';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

const noop = () => {};

describe('ArticleList', () => {
  it('renders empty state when no articles', () => {
    render(
      <ArticleList
        articles={[]}
        onSelectArticle={noop}
        selectedArticleId={null}
        feedTitle="Test Feed"
        sortOption={'date-desc'}
        onSortChange={noop}
        filterOption={'all'}
        onFilterChange={noop}
        totalFeedsCount={0}
        viewStyle={'list'}
        onViewStyleChange={noop}
      />
    );
    expect(screen.getByText(/No Articles Found/i)).toBeDefined();
  });
});
