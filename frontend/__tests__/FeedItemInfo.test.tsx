import { FeedItemInfo } from "../features/feeds/components/FeedItemInfo";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

const mockFeed = {
  id: "feed1",
  title: "Test Feed",
  url: "https://example.com/feed.xml",
};

describe("FeedItemInfo", () => {
  it("renders feed title", () => {
    render(<FeedItemInfo feed={mockFeed} />);
    expect(screen.getByText("Test Feed")).toBeDefined();
  });
});
