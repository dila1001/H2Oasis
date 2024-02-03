import { FC } from 'react';
import { User } from '../../services/usersService';
import { Plant } from '../../services/plantsService';
import AvatarGroup from '../../components/UI/AvatarGroup';
import { getDaysLeft } from '../../utils/dateUtils';

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
	const amountToWater = plants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft <= 0;
	});

	return (
		<div className='card bg-[#6E7E62] shadow-md my-6 flex-row'>
			<div className='p-4 flex-1 flex-row'>
				<div>
					<h2 key={householdName} className='card-title'>
						{householdName}
					</h2>

					{plants.length > 0 ? (
						<div className='flex flex-row justify-between'>
							<h2 key={plants.length}>{plants.length} plants</h2>
							{amountToWater.length > 0 && (
								<h2>{amountToWater.length} need water!</h2>
							)}
							{amountToWater.length === 0 && (
								<h2>All plants have been watered</h2>
							)}
						</div>
					) : (
						<div className='flex flex-row justify-between'>
							<h2>No plants...yet</h2>
							<h2>Add first plant</h2>
						</div>
					)}
					<AvatarGroup users={users} />
				</div>
			</div>
		</div>
	);
};

export default HouseholdCard;
