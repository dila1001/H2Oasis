import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../services/usersService';

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const silvia = {
		id: '101141217098569731496',
		firstName: 'Silvia',
		lastName: 'Dominguez',
		email: 'silvia.dominguez@appliedtechnology.se',
	};

	useEffect(() => {
		// const fetchUser = async () => {
		// 	try {
		// 		const data = await getUserInfo();
		// 		setIsLoggedIn(true);
		// 		setUser(data);
		// 	} catch (error) {
		// 		setIsLoggedIn(false);
		// 		setUser(null);
		// 	}
		// };

		// if (!user || !isLoggedIn) {
		// 	fetchUser();
		// 	console.log('fetching user');
		// }

		setIsLoggedIn(true);
		setUser(silvia);
	}, []);

	const value = {
		user,
		setUser,
		isLoggedIn,
		setIsLoggedIn,
	};

	return (
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	);
};

export default AuthProvider;
