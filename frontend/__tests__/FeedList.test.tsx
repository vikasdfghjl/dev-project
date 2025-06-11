import { FeedList } from "../features/feeds/components/FeedList";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("FeedList", () => {
  it("renders without crashing", () => {
    render(<FeedList feeds={[]} />);
    expect(true).toBe(true);
  });
});
