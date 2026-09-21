import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

describe("ConfirmDeleteDialog", () => {
  it("calls onConfirm and closes when the destructive action is confirmed", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    renderWithProviders(
      <ConfirmDeleteDialog open onOpenChange={onOpenChange} onConfirm={onConfirm} />
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not call onConfirm when cancelled", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    renderWithProviders(
      <ConfirmDeleteDialog open onOpenChange={onOpenChange} onConfirm={onConfirm} />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
