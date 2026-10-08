export const daysInMonth = (month, year) => {
  if (!month) return 31;
  return new Date(Date.UTC(Number(year) || 2000, Number(month), 0)).getUTCDate();
};

export const availableBirthDays = (month, year, today = new Date()) => {
  if (Number(year) === today.getFullYear() && Number(month) === today.getMonth() + 1) {
    return today.getDate();
  }
  return daysInMonth(month, year);
};

export const toBirthDate = (day, month, year) => {
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  const today = new Date();

  if (!day || !month || !year || !Number.isInteger(dayNumber) || !Number.isInteger(monthNumber)
    || !Number.isInteger(yearNumber) || yearNumber < 1900 || yearNumber > today.getFullYear()
    || monthNumber < 1 || monthNumber > 12 || dayNumber < 1
    || dayNumber > daysInMonth(monthNumber, yearNumber)) return "";

  const date = `${yearNumber}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return date > todayDate ? "" : date;
};
