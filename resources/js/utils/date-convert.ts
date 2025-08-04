import { differenceInCalendarDays, parseISO } from 'date-fns';

export function getStringAndConvertToDate(date: string) {
  return new Date(date);
}

export function convertDate(date: string) {
  const converted = getStringAndConvertToDate(date);

  const datePart = converted.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const timePart = converted.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return `${datePart}, ${timePart}`;
}

export default function convertDateDiffInfo(range: string | undefined, startDate: string | undefined, endDate: string | undefined): string {
  let info: string = '';

  if (range && range !== 'custom') {
    switch (range) {
      case 'today':
        info = 'dari Kemarin';
        break;
      case 'week':
        info = 'dari Minggu Lalu';
        break;
      case 'month':
        info = 'dari Bulan Lalu';
        break;
      case 'year':
        info = 'dari Tahun Lalu';
        break;
      default:
        info = '';
        break;
    }
  } else if (startDate && endDate) {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);

      const durationInDays = differenceInCalendarDays(end, start) + 1;

      if (durationInDays === 1) {
        info = 'Kemarin';
      } else {
        info = `dari ${durationInDays} hari sebelumnya`;
      }
    } catch (error) {
      info = '';
    }
  }

  return info;
}
