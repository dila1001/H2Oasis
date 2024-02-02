import api from '../api/api';
import { Plant } from './plantsService';
import { User } from './usersService';

const householdsUrlEndpoint = '/households';

// export type Household = {
// 	id: string;
// 	name: string;
// };

export type Household = {
	id: string;
	name: string;
	plants: Plant[];
	users: User[];
};

export type NewHousehold = {
	name: string;
};

export const getHouseholdsForUser = async (
	userId: string
): Promise<Household[] | null> => {
	const response = await api.get(`${householdsUrlEndpoint}/users/${userId}`);
	return response.data;
};

export const getHousehold = async (
	householdId: string
): Promise<Household | null> => {
	const response = await api.get(`${householdsUrlEndpoint}/${householdId}`);
	return response.data;
};

export const updateHousehold = async (
	householdId: string,
	newHousehold: NewHousehold
): Promise<Household | null> => {
	const response = await api.put(
		`${householdsUrlEndpoint}/${householdId}`,
		newHousehold
	);
	return response.data;
};

export const deleteHousehold = async (
	householdId: string
): Promise<Household | null> => {
	const response = await api.delete(`${householdsUrlEndpoint}/${householdId}`);
	return response.data;
};

export const createHousehold = async (
	name: string,
	userId: string
): Promise<Household> => {
	const response = await api.post(`${householdsUrlEndpoint}`, {
		name,
		userId,
	});
	return response.data;
};

export const AddUserToHousehold = async (
	householdId: string,
	userId: string
): Promise<Household> => {
	const response = await api.post(
		`${householdsUrlEndpoint}/${householdId}/users/${userId}`
	);
	return response.data;
};
