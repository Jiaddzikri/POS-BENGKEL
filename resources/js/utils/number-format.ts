export function numberFormat(number: number) {
  if (isNaN(number) || number === null) {
    return '';
  }

  return new Intl.NumberFormat().format(number);
}

export function getRawNumber(formattedValue: string) {
  return formattedValue.replace(/\D/g, '');
}