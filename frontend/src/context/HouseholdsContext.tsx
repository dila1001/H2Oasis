import { ReactNode, createContext, useState } from 'react';
import { Household } from '../services/householdsService';

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

	const value = {
		households,
		setHouseholds,
	};

	return (
		<HouseholdsContext.Provider value={value}>
			{children}
		</HouseholdsContext.Provider>
	);
}

export { HouseholdsProvider, HouseholdsContext };
