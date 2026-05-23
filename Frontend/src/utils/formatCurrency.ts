/**
 * Formats a number as Indian Rupees using the en‑IN locale.
 * Always shows two decimal places (e.g., ₹4,299.00).
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
export default formatCurrency;
