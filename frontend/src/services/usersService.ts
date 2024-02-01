import api from '../api/api';

const usersUrlEndpoint = '/users';

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
};

export const getUserInfo = async (): Promise<User> => {
	const response = await api.get(`${usersUrlEndpoint}`);
	return response.data;
};

export const getUsersForHousehold = async (
	householdId: string
): Promise<User[]> => {
	const response = await api.get(
		`${usersUrlEndpoint}/households/${householdId}`
	);
	return response.data;
};
