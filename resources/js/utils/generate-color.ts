/**
 * @param count - Jumlah warna yang ingin dibuat.
 * @returns Array berisi string warna HSL (contoh: ['hsl(180, 70%, 80%)', ...]).
 */
export function generatePastelColors(count: number): string[] {
  const colors: string[] = [];
  const saturation = 70;
  const lightness = 80;

  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}
