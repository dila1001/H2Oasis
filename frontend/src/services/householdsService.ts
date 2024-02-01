import api from '../api/api';

const householdsUrlEndpoint = '/households';

export type Household = {
	id: string;
	name: string;
};

export const getHouseholdsForUser = async (
	userId: string
): Promise<Household> => {
	const response = await api.get(`${householdsUrlEndpoint}/users/${userId}`);
	return response.data;
};

export const getHousehold = async (householdId: string): Promise<Household> => {
	const response = await api.get(`${householdsUrlEndpoint}/${householdId}`);
	return response.data;
};

// export const updateHousehold = async (householdId: string): Promise<Household> => {
// 	const response = await api.get(`${householdsUrlEndpoint}/${householdId}`);
// 	return response.data;
// };
