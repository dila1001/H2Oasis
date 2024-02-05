import api from '../api/api';

export type Plant = {
	id: string;
	name: string;
	species: string;
	imageUrl: string;
	location: string;
	uploadedImage?: File;
	wateringFrequencyInDays: string;
	lastWatered: string;
	lastWateredBy: string;
	waterAmountInMl: string;
};

export type NewPlant = {
	name: string;
	species: string;
	imageUrl: string;
	location: string;
	uploadedImage?: File;
	wateringFrequencyInDays: string;
	lastWatered: string;
	lastWateredBy: string;
	waterAmountInMl: string;
};

export const plantsUrlEndpoint = '/plants';

export const getPlants = async (
	householdId: string
): Promise<Plant[] | null> => {
	const response = await api.get(
		`${plantsUrlEndpoint}/households/${householdId}`
	);
	return response.data;
};

export const getPlantById = async (plantId: string): Promise<Plant | null> => {
	const response = await api.get(`${plantsUrlEndpoint}/${plantId}`);
	return response.data;
};

export const addPlant = async (
	householdId: string,
	{
		name,
		species,
		imageUrl,
		location,
		uploadedImage,
		wateringFrequencyInDays,
		lastWatered,
		lastWateredBy,
		waterAmountInMl,
	}: NewPlant
): Promise<Plant> => {
	const response = await api.post(
		`${plantsUrlEndpoint}/households/${householdId}`,
		{
			name,
			species,
			imageUrl,
			location,
			uploadedImage,
			wateringFrequencyInDays,
			lastWatered,
			lastWateredBy,
			waterAmountInMl,
		}
	);
	return response.data;
};

export const updatePlant = async (
	plantId: string,
	householdId: string,
	updatedPlant: NewPlant
): Promise<Plant | null> => {
	const response = await api.put(
		`${plantsUrlEndpoint}/${plantId}/households/${householdId}`,
		updatedPlant
	);
	return response.data;
};

export const deletePlant = async (plantId: string): Promise<void> => {
	const response = await api.delete(`${plantsUrlEndpoint}/${plantId}`);
	return response.data;
};
