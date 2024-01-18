import axios from 'axios';

export type Plant = {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  wateringFrequencyInDays: string;
  lastWatered: Date;
};

export type NewPlant = {
  name: string;
  species: string;
  imageUrl: string;
  wateringFrequencyInDays: string;
  lastWatered: Date;
};

const plantsApi = axios.create({
  baseURL: 'https://localhost:5005/api',
});

export const plantsUrlEndpoint = '/plants';

export const getPlants = async (): Promise<Plant[]> => {
  const response = await plantsApi.get(plantsUrlEndpoint);
  return response.data;
};

export const getPlantById = async (plantId: string): Promise<Plant | null> => {
  const response = await plantsApi.get(`${plantsUrlEndpoint}/${plantId}`);
  return response.data;
};

export const addPlant = async ({
  name,
  species,
  imageUrl,
  wateringFrequencyInDays,
  lastWatered,
}: NewPlant): Promise<Plant> => {
  const response = await plantsApi.post(plantsUrlEndpoint, {
    name,
    species,
    imageUrl,
    wateringFrequencyInDays,
    lastWatered,
  });
  return response.data;
};
