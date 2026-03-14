export function moneyFormat(amount: number): string {
  // Use Intl.NumberFormat to handle thousand separators automatically
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted;
}


