import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en-US.json";
import { SettingsProvider } from "@/features/settings/controller/SettingsContext";
import type { AppSettings } from "@/features/settings/model/types";

interface AllProvidersProps {
  children: ReactNode;
  initialSettings?: AppSettings;
}

const DEFAULT_TEST_SETTINGS: AppSettings = { locale: "en-US", currency: "USD" };

function AllProviders({ children, initialSettings }: AllProvidersProps) {
  return (
    <NextIntlClientProvider locale="en-US" messages={enMessages}>
      <SettingsProvider
        defaultLocale="en-US"
        initialSettings={initialSettings ?? DEFAULT_TEST_SETTINGS}
      >
        {children}
      </SettingsProvider>
    </NextIntlClientProvider>
  );
}

interface RenderWithProvidersOptions extends RenderOptions {
  initialSettings?: AppSettings;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions
) {
  const { initialSettings, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialSettings={initialSettings}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
