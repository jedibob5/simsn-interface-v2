export const getPasserRating = (
  isPro: boolean,
  passCompletions: number,
  passAttempts: number,
  passingYards: number,
  passingTDs: number,
  interceptions: number
): string => {
  if (passAttempts === 0) return "0.00";

  if (isPro) {
    const a = Math.min((passCompletions / passAttempts - 0.3) * 5, 2.375);
    const b = Math.min((passingYards / passAttempts - 3) * 0.25, 2.375);
    const c = Math.min((passingTDs / passAttempts) * 20, 2.375);
    const d = Math.min(2.375 - (interceptions / passAttempts) * 25, 2.375);

    return (((a + b + c + d) / 6) * 100).toFixed(2);
  } else {
    const numerator =
      8.4 * passingYards +
      330 * passingTDs +
      100 * passCompletions -
      200 * interceptions;

    return (numerator / passAttempts).toFixed(2);
  }
};