import api from '../api/api';
import { User } from './usersService';

export type Plant = {
	id: string;
	name: string;
	species: string;
	imageUrl: string;
	location: string;
	wateringFrequencyInDays: string;
	lastWatered: string;
	lastWateredBy: string;
	waterAmountInMl: string;
};

export type NewPlant = {
	name: string;
	species: string;
	image?: FileList;
	location: string;
	imageUrl?: string;
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
	plant: NewPlant,
	user: User
): Promise<Plant> => {
	const formData = new FormData();

	formData.append('name', plant.name);
	formData.append('species', plant.species);
	formData.append('location', plant.location);
	formData.append('wateringFrequencyInDays', plant.wateringFrequencyInDays);
	formData.append('lastWatered', plant.lastWatered);
	formData.append('lastWateredBy', user.firstName);
	formData.append('waterAmountInMl', plant.waterAmountInMl);
	if (plant.imageUrl) {
		formData.append('imageUrl', plant.imageUrl);
	}
	if (typeof plant.image === 'object') {
		formData.append('image', plant.image[0]);
	}

	const response = await api.postForm(
		`${plantsUrlEndpoint}/households/${householdId}`,
		formData
	);
	return response.data;
};

export const updatePlant = async (
	plantId: string,
	householdId: string,
	plant: NewPlant,
	user?: User
): Promise<Plant | null> => {
	const formData = new FormData();

	formData.append('name', plant.name);
	formData.append('species', plant.species);
	formData.append('location', plant.location);
	formData.append('wateringFrequencyInDays', plant.wateringFrequencyInDays);
	formData.append('lastWatered', plant.lastWatered);
	formData.append('waterAmountInMl', plant.waterAmountInMl);
	if (user) {
		formData.append('lastWateredBy', user.firstName);
	} else {
		formData.append('lastWateredBy', plant.lastWateredBy);
	}
	if (plant.imageUrl) {
		formData.append('imageUrl', plant.imageUrl);
	}
	if (typeof plant.image === 'object') {
		formData.append('image', plant.image[0]);
	}

	const response = await api.put(
		`${plantsUrlEndpoint}/${plantId}/households/${householdId}`,
		formData
	);
	return response.data;
};

export const deletePlant = async (plantId: string): Promise<void> => {
	const response = await api.delete(`${plantsUrlEndpoint}/${plantId}`);
	return response.data;
};
