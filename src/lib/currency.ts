export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}
