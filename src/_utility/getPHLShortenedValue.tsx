export const getPHLShortenedValue = (value: number): number => {
  return value ? parseFloat(value.toFixed(2)) : 0;
};
