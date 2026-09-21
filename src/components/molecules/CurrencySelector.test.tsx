import { describe, expect, it } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { CurrencySelector } from "./CurrencySelector";

describe("CurrencySelector", () => {
  it("shows the current currency and lets the user pick another one", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CurrencySelector />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByRole("combobox", { name: "Currency" })).toHaveTextContent(
      "USD"
    );

    await user.click(screen.getByRole("combobox", { name: "Currency" }));
    await user.click(await screen.findByRole("option", { name: "EUR" }));

    expect(screen.getByRole("combobox", { name: "Currency" })).toHaveTextContent(
      "EUR"
    );
  });
});
