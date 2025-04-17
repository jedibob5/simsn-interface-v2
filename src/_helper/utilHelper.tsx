export const GenerateNumberFromRange = (min: number, max: number): number => {
  if (min > max) {
    // Swap min and max if min is greater than max
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getCompetitivenessLabel = (value: number) => {
  switch (value) {
    case 1:
      return "Lazy";
    case 2:
      return "Slacker";
    case 3:
      return "Milquetoast";
    case 4:
      return "Needs Motivation";
    case 5:
      return "Average";
    case 6:
      return "Focused";
    case 7:
      return "Engrossed";
    case 8:
      return "Fierce";
    case 9:
      return "Cutthroat";
    default:
      return "Distracted";
  }
};

export const getTeamLoyaltyLabel = (value: number) => {
  switch (value) {
    case 1:
      return "Apathetic";
    case 2:
      return "Wavering";
    case 3:
      return "Fickle";
    case 4:
      return "Uninterested";
    case 5:
      return "Average";
    case 6:
      return "Dependable";
    case 7:
      return "Trusted";
    case 8:
      return "Devoted";
    case 9:
      return "Unwavering";
    default:
      return "Distracted";
  }
};

export const getPlaytimePreferenceLabel = (value: number) => {
  switch (value) {
    case 1:
      return "Complacent";
    case 2:
      return "Patient";
    case 3:
      return "Passive";
    case 4:
      return "Uninterested";
    case 5:
      return "Average";
    case 6:
      return "Avid";
    case 7:
      return "Driven";
    case 8:
      return "Ambitious";
    case 9:
      return "Zealous";
    default:
      return "Distracted";
  }
};

export const getFAMarketPreference = (value: number): string => {
  const valueMap: Record<number, string> = {
    1: "Average",
    2: "Close to Home",
    3: "CountryMen",
    4: "Large Market",
    5: "No Large Market",
    6: "Small Market",
    7: "No Small Market",
    8: "Loyal to Team",
    9: "Avoiding Prev. Team",
  };
  return valueMap[value];
};

export const getFACompetitivePreference = (value: number): string => {
  const valueMap: Record<number, string> = {
    1: "Average",
    2: "Seeking Mentorship",
    3: "Veteran Mentor",
    4: "First Line",
    5: "Second Line",
    6: "Competitive Team",
  };
  return valueMap[value];
};

export const getFAFinancialPreference = (value: number): string => {
  const valueMap: Record<number, string> = {
    1: "Average",
    2: "Short Contract",
    3: "Long Contract",
    4: "Large AAV",
  };
  return valueMap[value];
};
