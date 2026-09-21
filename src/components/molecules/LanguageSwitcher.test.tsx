import { describe, expect, it } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("shows the current language and lets the user switch it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />, {
      initialSettings: { locale: "en-US", currency: "USD" },
    });

    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent(
      "English (US)"
    );

    await user.click(screen.getByRole("combobox", { name: "Language" }));
    await user.click(
      await screen.findByRole("option", { name: "Português (BR)" })
    );

    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent(
      "Português (BR)"
    );
  });
});
