import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { User, getUserInfo } from '../services/usersService';

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await getUserInfo();
				setUser(data);
				setIsLoggedIn(true);
			} catch (error) {
				setIsLoggedIn(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		if (!user || !isLoggedIn) {
			fetchUser();
		}
	}, [user, isLoggedIn]);

	const value = {
		user,
		setUser,
		isLoggedIn,
		setIsLoggedIn,
	};

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<span className='loading loading-dots loading-lg text-secondary'></span>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	);
};

export default AuthProvider;
