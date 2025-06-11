import { ArticleView } from "../features/articles/ArticleView";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const mockArticle = {
  id: "1",
  title: "Test Article",
  link: "https://example.com",
  pubDate: new Date().toISOString(),
  feedId: "feed1",
};

describe("ArticleView", () => {
  it("renders without crashing", () => {
    render(<ArticleView article={mockArticle} onBack={() => {}} />);
    expect(true).toBe(true);
  });
});
