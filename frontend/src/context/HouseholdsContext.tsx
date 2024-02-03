import { ReactNode, createContext, useEffect, useState } from 'react';
import { Household, getHouseholdsForUser } from '../services/householdsService';
import { useAuth } from '../auth/useAuth';

export interface HouseholdsContextValue {
	households: Household[] | null;
	setHouseholds: React.Dispatch<React.SetStateAction<Household[] | null>>;
}

const HouseholdsContext = createContext<HouseholdsContextValue>({
	households: [],
	setHouseholds: () => {},
});

function HouseholdsProvider({ children }: { children: ReactNode }) {
	const [households, setHouseholds] = useState<Household[] | null>([]);
	const { user } = useAuth();

	const value = {
		households,
		setHouseholds,
	};

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				const households = await getHouseholdsForUser(user.id);
				if (households) {
					setHouseholds(households);
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
