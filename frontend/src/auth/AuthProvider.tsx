import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User, getUserInfo } from '../services/usersService';

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// const adila = {
	// 	id: '114826145929737499604',
	// 	firstName: 'Adila',
	// 	lastName: 'Razmi',
	// 	email: 'adila93@gmail.com',
	// };

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getUserInfo();
				setIsLoggedIn(true);
				setUser(data);
			} catch (error) {
				setIsLoggedIn(false);
				setUser(null);
			}
		};

		if (!user || !isLoggedIn) {
			fetchUser();
			console.log('fetching user');
		}

		console.log('called');
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
