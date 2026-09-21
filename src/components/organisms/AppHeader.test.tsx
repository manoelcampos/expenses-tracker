import { describe, expect, it } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders the app name and primary navigation links", () => {
    renderWithProviders(<AppHeader />);

    expect(screen.getByText("Expense Tracker")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Expenses" }).length).toBeGreaterThan(0);
  });

  it("opens the mobile menu with navigation and settings controls", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppHeader />);

    await user.click(screen.getByRole("button", { name: "Menu" }));

    expect(await screen.findByRole("combobox", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Currency" })).toBeInTheDocument();
  });
});
