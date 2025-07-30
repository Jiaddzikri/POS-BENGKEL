export function convertCurrency(num: number) {

  const convertToNumber = Number(num);

  return convertToNumber.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}