import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/test/test-utils";
import { CategoryBadge } from "./CategoryBadge";

describe("CategoryBadge", () => {
  it("renders the translated category label", () => {
    renderWithProviders(<CategoryBadge category="Food" />);
    expect(screen.getByText("Food")).toBeInTheDocument();
  });
});
