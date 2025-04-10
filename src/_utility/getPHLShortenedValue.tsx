export const getPHLShortenedValue = (value: number): number => {
  return value ? parseFloat((value / 1_000_000).toFixed(2)) : 0;
};
