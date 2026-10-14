// Dates are plain "YYYY-MM-DD" strings so they compare correctly and never shift with time zones.
const pad = (value) => String(value).padStart(2, "0");

export const toDayString = (year, monthIndex, day) => `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export const todayString = (now = new Date()) => toDayString(now.getFullYear(), now.getMonth(), now.getDate());

export const parseDay = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
};

// Six Monday-first weeks covering the month; days outside it are null.
export const monthGrid = (year, monthIndex) => {
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? toDayString(year, monthIndex, day) : null;
  });
};

export const shiftMonth = ({ year, monthIndex }, step) => {
  const date = new Date(year, monthIndex + step, 1);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
};

// First click picks a day; a second click on a later day makes a range, an earlier one restarts it.
export const pickDay = ({ from, to }, day) => {
  if (!from || to) return { from: day, to: "" };
  if (day < from) return { from: day, to: "" };
  if (day === from) return { from, to: "" };
  return { from, to: day };
};

export const isInRange = (day, from, to) => Boolean(day && from && to && day >= from && day <= to);
