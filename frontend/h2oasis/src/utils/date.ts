import { addDays, differenceInDays, format, parseISO } from 'date-fns';

export const getDaysLeft = (
  lastWateredDate: string,
  wateringFrequency: number
): number => {
  const today = new Date();
  const lastWatered = parseISO(lastWateredDate);

  const nextWateringDay = addDays(lastWatered, wateringFrequency);

  const daysLeft = differenceInDays(nextWateringDay, today);

  return daysLeft >= 0 ? daysLeft : 0;
};

export const getPercentage = (
  daysLeft: number,
  wateringFrequency: number
): number => {
  const percentage = (daysLeft / wateringFrequency) * 100;
  return Math.ceil(percentage);
};

export const getTodaysDate = (): string => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss");
  return formattedDate;
};
