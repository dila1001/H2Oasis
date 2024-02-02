import { createContext } from 'react';
import { User } from '../services/usersService';

export interface AuthContextValue {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextValue>({
	user: null,
	setUser: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
});
