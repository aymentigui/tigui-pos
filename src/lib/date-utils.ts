// src/main/date-utils.ts
export const addDays = (epochMs: number, days: number) =>
    epochMs + days * 24 * 60 * 60 * 1000;
  