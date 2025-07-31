export const formatVND = (amount: string | number): string => {
  // Convert input to number, handling both string and number inputs
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/\./g, '')) : amount;
  
  // Check if the number is valid
  if (isNaN(num)) {
    return '0';
  }
  
  // Format number with commas as thousand separators
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};