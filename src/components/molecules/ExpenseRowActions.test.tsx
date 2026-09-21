import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { ExpenseRowActions } from "./ExpenseRowActions";

describe("ExpenseRowActions", () => {
  it("invokes onEdit when the edit menu item is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(<ExpenseRowActions onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("invokes onDelete when the delete menu item is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(<ExpenseRowActions onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
