import { ReactNode, createContext, useEffect, useState } from 'react';
import { Household, getHouseholdsForUser } from '../services/householdsService';
import { useAuth } from '../auth/useAuth';

export interface HouseholdsContextValue {
	households: Household[] | null;
	setHouseholds: React.Dispatch<React.SetStateAction<Household[] | null>>;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const HouseholdsContext = createContext<HouseholdsContextValue>({
	households: [],
	setHouseholds: () => {},
	isLoading: false,
	setIsLoading: () => {},
	error: false,
	setError: () => {},
});

function HouseholdsProvider({ children }: { children: ReactNode }) {
	const [households, setHouseholds] = useState<Household[] | null>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const { user } = useAuth();

	const value = {
		households,
		setHouseholds,
		isLoading,
		setIsLoading,
		error,
		setError,
	};

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				try {
					setIsLoading(true);
					setError(false);
					const data = await getHouseholdsForUser(user.id);
					setHouseholds(data);
					// setError(true);
				} catch (error) {
					setError(true);
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchData();
	}, [user]);

	return (
		<HouseholdsContext.Provider value={value}>
			{children}
		</HouseholdsContext.Provider>
	);
}

export { HouseholdsProvider, HouseholdsContext };
