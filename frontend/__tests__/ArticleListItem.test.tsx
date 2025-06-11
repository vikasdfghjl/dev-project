import { ArticleListItem } from "../features/articles/ArticleListItem";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const mockArticle = {
  id: "1",
  title: "Test Article",
  link: "",
  pubDate: new Date().toISOString(),
  feedId: "feed1",
};

describe("ArticleListItem", () => {
  it("renders article item", () => {
    render(
      <ArticleListItem
        article={mockArticle}
        isSelected={false}
        onSelect={() => {}}
      />
    );
    expect(screen.getByText("Test Article")).toBeDefined();
  });
});
