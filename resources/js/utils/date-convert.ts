export function getStringAndConvertToDate(date: string) {
  return new Date(date);
}

export function convertDate(date: string) {

  const converted = getStringAndConvertToDate(date);

  const datePart = converted.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const timePart = converted.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return `${datePart}, ${timePart}`;
}