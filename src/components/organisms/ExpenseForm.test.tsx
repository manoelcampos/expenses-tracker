import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent, waitFor } from "@/test/test-utils";
import { ExpenseForm } from "./ExpenseForm";

describe("ExpenseForm", () => {
  it("renders all fields with translated labels", () => {
    renderWithProviders(<ExpenseForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("shows validation errors and does not submit when the data is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Amount must be greater than zero")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderWithProviders(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    const amountInput = screen.getByPlaceholderText("0.00");
    await user.clear(amountInput);
    await user.type(amountInput, "42.5");

    await user.type(screen.getByPlaceholderText("e.g. Weekly groceries"), "Groceries");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.amount).toBe(42.5);
    expect(submitted.description).toBe("Groceries");
    expect(submitted.category).toBe("Food");
    expect(submitted.currency).toBe("USD");
  });

  it("defaults the currency to the app's base currency and allows overriding it", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    renderWithProviders(<ExpenseForm onSubmit={onSubmit} onCancel={vi.fn()} />, {
      initialSettings: { locale: "en-US", currency: "EUR" },
    });

    const currencyTrigger = screen.getAllByRole("combobox")[0];
    expect(currencyTrigger).toHaveTextContent("EUR");

    await user.click(currencyTrigger);
    await user.click(await screen.findByRole("option", { name: "GBP" }));

    const amountInput = screen.getByPlaceholderText("0.00");
    await user.clear(amountInput);
    await user.type(amountInput, "10");
    await user.type(screen.getByPlaceholderText("e.g. Weekly groceries"), "Tea");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0].currency).toBe("GBP");
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    renderWithProviders(<ExpenseForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
