import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("calls onChange with the typed value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <SearchInput value="" onChange={onChange} placeholder="Search" />
    );

    await user.type(screen.getByPlaceholderText("Search"), "grocer");

    expect(onChange).toHaveBeenLastCalledWith("r");
    expect(onChange).toHaveBeenCalledTimes(6);
  });
});
