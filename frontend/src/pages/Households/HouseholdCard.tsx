import { FC } from 'react';
import { User } from '../../services/usersService';
import { Plant } from '../../services/plantsService';
import { DateValues } from 'date-fns';

type HouseholdCardProps = {
	householdName: string;
	plants: Plant[];
	users: User[];
};


const HouseholdCard: FC<HouseholdCardProps> = ({
    householdName,
	plants,
	users,
}) => {
    const pendingWatering = plants.map((p) => p.lastWatered as DateValues);
    const today = new Date();
    const amountToWater = pendingWatering.filter((d) => (d as Date) <= today)
    console.log(amountToWater, 'dates')
    // console.log(today.toISOString().split('T')[0], 'today')
    console.log(today, 'today')

	return (
		<div className='card bg-[#f9fcf4] shadow-md my-6 flex-row'>
			<div className='card-body p-4 flex-1 flex-row'>
				<div>
					<h2 key={householdName} className='card-title'>
						{householdName}
					</h2>
					<h2 key={plants.length}>{plants.length} plants</h2>
					{/* <h2 key={needWatering}>{needWatering} need water!</h2> */}
					{users.map((u) => (
						<h2 key={u.id}>
							{u.firstName[0]}
							{u.lastName[0]}
						</h2>
					))}
				</div>
			</div>
		</div>
	);
};

export default HouseholdCard;
