import { useState, useMemo } from 'react';
import type { Article, ArticleSortOption, ArticleFilterOption } from '../types';

export interface UseArticleFilteringOptions {
  articles: Article[];
  initialSortOption?: ArticleSortOption;
  initialFilterOption?: ArticleFilterOption;
  initialSearchQuery?: string;
}

export interface UseArticleFilteringReturn {
  filteredAndSortedArticles: Article[];
  sortOption: ArticleSortOption;
  setSortOption: (option: ArticleSortOption) => void;
  filterOption: ArticleFilterOption;
  setFilterOption: (option: ArticleFilterOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

/**
 * Custom hook for filtering, sorting, and searching articles
 * Centralizes the logic that was previously duplicated across components
 */
export const useArticleFiltering = ({
  articles,
  initialSortOption = 'date-desc',
  initialFilterOption = 'all',
  initialSearchQuery = ''
}: UseArticleFilteringOptions): UseArticleFilteringReturn => {
  const [sortOption, setSortOption] = useState<ArticleSortOption>(initialSortOption);
  const [filterOption, setFilterOption] = useState<ArticleFilterOption>(initialFilterOption);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.contentSnippet?.toLowerCase().includes(query) ||
        article.author?.toLowerCase().includes(query) ||
        article.feedTitle?.toLowerCase().includes(query)
      );
    }

    // Apply read/unread filter
    if (filterOption === 'read') {
      filtered = filtered.filter(article => article.isRead);
    } else if (filterOption === 'unread') {
      filtered = filtered.filter(article => !article.isRead);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        case 'date-asc':
          return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, sortOption, filterOption, searchQuery]);

  return {
    filteredAndSortedArticles,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    searchQuery,
    setSearchQuery,
    totalCount: articles.length,
    filteredCount: filteredAndSortedArticles.length
  };
};
