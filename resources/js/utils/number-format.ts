export function numberFormat(number: number) {
  if (isNaN(number) || number === null) {
    return '';
  }

  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Format a number as Indonesian Rupiah currency.
 * Output example: "Rp 1.500.000"
 */
export function formatRupiah(number: number): string {
  if (isNaN(number) || number === null) {
    return 'Rp 0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function getRawNumber(formattedValue: string) {
  return formattedValue.replace(/\D/g, '');
}