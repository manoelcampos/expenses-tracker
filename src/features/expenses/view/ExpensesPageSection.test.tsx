import { describe, expect, it } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test/test-utils";
import { ExpensesPageSection } from "./ExpensesPageSection";

describe("ExpensesPageSection", () => {
  it("shows the empty state, adds an expense, then deletes it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExpensesPageSection />);

    // Both the desktop table and mobile card list render in jsdom (no real
    // CSS breakpoints), so the empty message and each row appear twice.
    expect((await screen.findAllByText("No expenses recorded yet.")).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Add Expense" }));
    const amountInput = await screen.findByPlaceholderText("0.00");
    await user.clear(amountInput);
    await user.type(amountInput, "25");
    await user.type(screen.getByPlaceholderText("e.g. Weekly groceries"), "Coffee");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect((await screen.findAllByText("Coffee")).length).toBeGreaterThan(0);
    expect(screen.queryByText("No expenses recorded yet.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeEnabled();

    const [firstActionsButton] = screen.getAllByRole("button", { name: "Actions" });
    await user.click(firstActionsButton);
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.getAllByText("No expenses recorded yet.").length).toBeGreaterThan(0)
    );
  });
});
