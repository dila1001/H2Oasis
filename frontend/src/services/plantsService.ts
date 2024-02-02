import api from '../api/api';

export type Plant = {
	id: string;
	name: string;
	species: string;
	// imageUrl: string;
	uploadedImage: File;
	wateringFrequencyInDays: string;
	lastWatered: string;
	waterAmountInMl: string;
};

export type NewPlant = {
	name: string;
	species: string;
	// imageUrl: string;
	uploadedImage: File;
	wateringFrequencyInDays: string;
	lastWatered: string;
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

export const addPlant = async ({
	name,
	species,
	// imageUrl,
	uploadedImage,
	wateringFrequencyInDays,
	lastWatered,
	waterAmountInMl,
}: NewPlant): Promise<Plant> => {
	const response = await api.post(plantsUrlEndpoint, {
		name,
		species,
		// imageUrl,
		uploadedImage,
		wateringFrequencyInDays,
		lastWatered,
		waterAmountInMl,
	});
	return response.data;
};

export const updatePlant = async (
	plantId: string,
	updatedPlant: NewPlant
): Promise<Plant | null> => {
	const response = await api.put(
		`${plantsUrlEndpoint}/${plantId}`,
		updatedPlant
	);
	return response.data;
};
