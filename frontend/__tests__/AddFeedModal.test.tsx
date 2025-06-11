import { render, screen } from "@testing-library/react";
import { AddFeedModal } from "../features/feeds/AddFeedModal";
import { describe, it, expect, vi } from "vitest";

describe("AddFeedModal", () => {
  it("renders modal with form fields", () => {
    render(<AddFeedModal onClose={vi.fn()} onAddFeed={vi.fn()} folders={[]} />);
    expect(screen.getByLabelText(/RSS Feed URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Feed Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Add to Folder/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Feed/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });
});
