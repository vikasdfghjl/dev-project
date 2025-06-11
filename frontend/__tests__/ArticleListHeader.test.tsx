import { ArticleListHeader } from "../features/articles/ArticleListHeader";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("ArticleListHeader", () => {
  it("renders article list header", () => {
    render(
      <ArticleListHeader
        feedTitle="Test Feed"
        articleCount={5}
        sortOption="date-desc"
        onSortChange={() => {}}
        filterOption="all"
        onFilterChange={() => {}}
        viewStyle="list"
        onViewStyleChange={() => {}}
      />
    );
    expect(screen.getByText("Test Feed")).toBeDefined();
    expect(screen.getByText("5 article(s) displayed")).toBeDefined();
  });
});
