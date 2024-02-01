import { useEffect } from 'react';
import { Household, getHouseholdsForUser } from '../../services/householdsService';

const HouseholdsPage = () => {
	// const [households, setHouseholds] = useEffect<Household[]>([]);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const households = await getHouseholdsForUser();
	// 		setHouseholds(households);
	// 		setIsLoading(false);
	// 	};
	// 	fetchData();
	// }, []);

	return <div>Households Page</div>;
};

export default HouseholdsPage;
