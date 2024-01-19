import { addDays, differenceInDays, format, parseISO } from 'date-fns';

export const getDaysLeft = (
  lastWateredDate: string,
  wateringFrequency: string
): number => {
  const today = new Date();
  const lastWatered = parseISO(lastWateredDate);

  const nextWateringDay = addDays(lastWatered, parseInt(wateringFrequency, 10));

  const daysLeft = differenceInDays(nextWateringDay, today);

  return daysLeft >= 0 ? daysLeft : 0;
};

export const getPercentage = (
  daysLeft: number,
  wateringFrequency: string
): number => {
  const percentage = (daysLeft / parseInt(wateringFrequency, 10)) * 100;
  return Math.ceil(percentage);
};

export const getTodaysDate = (): string => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss");
  return formattedDate;
};
