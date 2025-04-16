import { MAX_SALARY, MIN_SALARY } from "../_constants/constants";
import {
  FreeAgencyOffer as PHLFreeAgencyOffer,
  ProCapsheet,
  Timestamp,
} from "../models/hockeyModels";

export const getPHLSalaryData = (offer: PHLFreeAgencyOffer) => {
  const {
    Y1BaseSalary,
    Y2BaseSalary,
    Y3BaseSalary,
    Y4BaseSalary,
    Y5BaseSalary,
    ContractLength,
    ContractValue,
  } = offer;

  const salaries: number[] = [
    Y1BaseSalary ?? 0,
    Y2BaseSalary ?? 0,
    Y3BaseSalary ?? 0,
    Y4BaseSalary ?? 0,
    Y5BaseSalary ?? 0,
  ].map((s) => (isNaN(s) ? 0 : s));

  const totalComp = salaries.reduce((sum, val, i) => {
    return i < ContractLength ? sum + val : sum;
  }, 0);

  return { Y1BaseSalary, ContractLength, ContractValue, totalComp, salaries };
};

const getFirstHalfAAV = (
  salaries: number[],
  contractLength: number
): number => {
  if (contractLength === 0) return 0;

  const half = Math.floor(contractLength / 2);
  const isOdd = contractLength % 2 === 1;

  let total = 0;
  for (let i = 0; i < half; i++) {
    total += salaries[i];
  }

  if (isOdd) {
    total += salaries[half] / 2;
    return total / (half + 0.5);
  }

  return total / half;
};

const validateYearlySalaryRange = (
  salaries: number[],
  min: number,
  max: number
): string[] => {
  const errs: string[] = [];
  salaries.forEach((salary, index) => {
    let s = salary || 0;
    if (!salary) {
      s = 0;
    }
    const year = index + 1;
    if (s > 0 && s < min) {
      errs.push(`Y${year} Base Salary is less than the minimum: ${s}`);
    }
    if (salary > max) {
      errs.push(`Y${year} Base Salary is greater than the maximum: ${s}`);
    }
  });
  return errs;
};

const validateYearCap = (
  year: number,
  salary: number,
  teamCap: number,
  capLimit: number
): string | null => {
  const total = salary + teamCap;
  if (total > capLimit) {
    return `Year ${year} cap exceeded by ${(total - capLimit).toFixed(2)}.`;
  }
  return null;
};

export const GeneratePHLFAErrorList = (
  offer: PHLFreeAgencyOffer,
  ts: Timestamp,
  capsheet: ProCapsheet
): string[] => {
  const errors: string[] = [];
  const { salaries, ContractLength, ContractValue, totalComp, Y1BaseSalary } =
    getPHLSalaryData(offer);

  const firstHalfAAV = getFirstHalfAAV(salaries, ContractLength);

  const isFrontLoaded = firstHalfAAV > ContractValue;

  if (isFrontLoaded) {
    // --- Front-loaded contract rules ---

    const y1Comp = salaries[0];
    const maxDiff = y1Comp * 0.25;
    const maxYear = Math.max(...salaries);
    const minAllowed = maxYear * 0.6;

    for (let i = 0; i < ContractLength; i++) {
      const current = salaries[i];

      if (current < minAllowed) {
        errors.push(
          `Year ${
            i + 1
          } compensation (${current}) is less than 60% of the highest compensated year (${maxYear}).`
        );
      }

      // Check diff with previous year
      if (i > 0) {
        const prev = salaries[i - 1];
        const diff = Math.abs(current - prev);
        if (diff > maxDiff) {
          errors.push(
            `Year-to-year compensation change from Year ${i} to ${
              i + 1
            } (${diff}) exceeds 25% of Year 1 (${maxDiff}).`
          );
        }
      }
    }
  } else {
    // --- Back-loaded contract rules ---

    const y1 = salaries[0];
    const y2 = salaries[1] ?? 0;
    const minY1Y2 = Math.min(y1, y2);

    if (y2 > y1 * 2) {
      errors.push(`Year 2 compensation (${y2}) exceeds double Year 1 (${y1}).`);
    }

    for (let i = 2; i < ContractLength; i++) {
      const prev = salaries[i - 1];
      const curr = salaries[i];
      const increase = curr - prev;

      if (increase > 0 && increase > minY1Y2) {
        errors.push(
          `Year ${
            i + 1
          } increase (${increase}) exceeds the allowed limit based on Year 1 and 2 (${minY1Y2}).`
        );
      }

      if (increase < 0 && Math.abs(increase) > minY1Y2 * 0.5) {
        errors.push(
          `Year ${i + 1} decrease (${Math.abs(
            increase
          )}) exceeds 50% of min(Year 1, 2): ${minY1Y2 * 0.5}.`
        );
      }
    }
  }

  const isSalaryBeyondLength = salaries
    .slice(ContractLength)
    .some((salary) => salary > 0);

  if (isSalaryBeyondLength) {
    errors.push(
      "Contract has salary allocated beyond the specified length of contract."
    );
  }

  if (ContractLength > 0 && totalComp === 0) {
    errors.push(
      "Contract length is greater than 0, but no yearly salary has been entered."
    );
  }

  errors.push(...validateYearlySalaryRange(salaries, MIN_SALARY, MAX_SALARY));

  const capError = validateYearCap(
    1,
    Y1BaseSalary,
    capsheet.Y1Salary,
    ts.Y1Capspace
  );
  if (capError) errors.push(capError);

  return errors;
};
