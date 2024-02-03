import { FC } from 'react';
import { User } from '../../services/usersService';
import { Plant } from '../../services/plantsService';
import AvatarGroup from '../../components/UI/AvatarGroup';
import { getDaysLeft } from '../../utils/dateUtils';
import { FaDroplet, FaLeaf } from 'react-icons/fa6';

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
		<div className='card bg-[#6E7E62] shadow-md my-6 text-white'>
			<div className='p-4 grid grid-cols-1 gap-2'>
				<h2 key={householdName} className='card-title justify-self-center'>
					{householdName}
				</h2>

				{plants.length > 0 ? (
					<div className='flex justify-around col-span-2'>
						<div className='flex gap-2 items-center'>
							<FaLeaf />
							<h2 key={plants.length}>{plants.length} plants</h2>
						</div>

						<div className='flex gap-2 items-center'>
							<FaDroplet />
							{amountToWater.length > 0 && (
								<h2>{amountToWater.length} need water!</h2>
							)}
							{amountToWater.length === 0 && (
								<h2>All plants have been watered</h2>
							)}
						</div>
					</div>
				) : (
					<div className='flex justify-around'>
						<div className='flex gap-2 items-center'>
							<FaLeaf />
							<h2>No plants...yet</h2>
						</div>

						<div className='flex gap-2 items-center'>
							<FaDroplet />
							<h2>Add first plant</h2>
						</div>
					</div>
				)}
				<AvatarGroup users={users} styles='justify-self-center' />
			</div>
		</div>
	);
};

export default HouseholdCard;
