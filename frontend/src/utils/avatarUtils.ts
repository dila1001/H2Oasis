import { User } from '../services/usersService';

export const generateInitials = (user: User): string => {
	const firstNameInitial = user.firstName.charAt(0).toUpperCase();
	const lastNameInitial = user.lastName.charAt(0).toUpperCase();
	return `${firstNameInitial}${lastNameInitial}`;
};
