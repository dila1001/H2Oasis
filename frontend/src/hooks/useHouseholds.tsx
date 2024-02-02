import { useContext } from 'react';
import {
	HouseholdsContext,
	HouseholdsContextValue,
} from '../context/HouseholdsContext';

export const useHouseholds = () => {
	const contextValue = useContext(HouseholdsContext);

	if (!contextValue) {
		throw new Error('useHouseholds must be used within an AuthProvider');
	}

	return contextValue as HouseholdsContextValue;
};
