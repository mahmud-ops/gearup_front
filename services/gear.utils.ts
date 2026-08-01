export const calculateDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays + 1 : 0;
};

export const calculatePrice = (dailyAmount: number, totalDays: number): number => {
  if (totalDays <= 0 || dailyAmount <= 0) return 0;
  return dailyAmount * totalDays;
};