import { useEffect, useState } from 'react';
import {
	Household,
	getHouseholdsForUser,
} from '../../services/householdsService';
import { useAuth } from '../../auth/useAuth';
import { Link } from 'react-router-dom';

const HouseholdsPage = () => {
	const [households, setHouseholds] = useState<Household[]>([]);
	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			const households = await getHouseholdsForUser(user!.id);
			setHouseholds(households);
		};
		fetchData();
	}, []);

	return (
		<div className='mx-5'>
			<h2 className='font-bold'>Households of {user?.firstName}</h2>
			{households.map((h) => (
				<Link
					to={`/${h.id}/plants`}
					key={h.id}
				>
					{h.name}
				</Link>
			))}
		</div>
	);
};

export default HouseholdsPage;
