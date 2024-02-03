import { FC } from 'react';
import { User } from '../../services/usersService';
import { Plant } from '../../services/plantsService';
import AvatarGroup from '../../components/UI/AvatarGroup';

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
    // const pendingWatering = plants.map((p) => p.lastWatered as DateValues);
    // const today = new Date();
    // const amountToWater = pendingWatering.filter((d) => (d as Date) <= today)

	return (
		<div className='card bg-[#f9fcf4] shadow-md my-6 flex-row'>
			<div className='card-body p-4 flex-1 flex-row'>
				<div>
					<h2 key={householdName} className='card-title'>
						{householdName}
					</h2>
					<h2 key={plants.length}>{plants.length} plants</h2>
					{/* <h2 key={needWatering}>{needWatering} need water!</h2> */}
					<AvatarGroup users={users} />
				</div>
			</div>
		</div>
	);
};

export default HouseholdCard;
