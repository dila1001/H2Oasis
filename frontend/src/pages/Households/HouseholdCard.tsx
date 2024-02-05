import { FC } from 'react';
import { User } from '../../services/usersService';
import { Plant } from '../../services/plantsService';
import AvatarGroup from '../../components/UI/AvatarGroup';
import { getDaysLeft } from '../../utils/dateUtils';
import { FaDroplet, FaLeaf } from 'react-icons/fa6';
import { FaEllipsisV } from 'react-icons/fa';

type HouseholdCardProps = {
	householdName: string;
	plants: Plant[];
	users: User[];
	onClick: () => void;
	onEditName: () => void;
	onDelete: () => void;
};

const HouseholdCard: FC<HouseholdCardProps> = ({
	householdName,
	plants,
	users,
	onClick,
	onEditName,
	onDelete
}) => {
	const amountToWater = plants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft <= 0;
	});

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onClick) {
			onClick();
		}
		
	};

	return (
		<div className='card bg-[#f9fcf4] shadow-md mb-6 h-32 flex flex-col p-4'>
			<div className='flex items-center justify-between'>
				<h3 className='card-title'>{householdName}</h3>

				<div className='dropdown dropdown-end dropdown-hover'>
					<div tabIndex={0} role='button'>
						<FaEllipsisV
							className='text-xs text-base-300'
							onClick={handleClick}
						/>
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu p-2 shadow bg-[#f9fcf4] rounded-box w-40'
					>
						<li onClick={onEditName}>Edit Name</li>
						<li onClick={onDelete}>Delete</li>
					</ul>
				</div>
			</div>
			<div className='flex flex-row grow'>
				<div className='flex flex-col mt-auto gap-2'>
					<div className='badge badge-ghost text-xs'>
						<FaLeaf className='mr-2' />
						<p>
							{plants.length} plant{plants.length !== 1 ? 's' : ''}
						</p>
					</div>

					<div className='badge text-xs'>
						<FaDroplet className='mr-2' />
						{plants.length === 0 ? (
							<p>Add a plant</p>
						) : amountToWater.length === 0 ? (
							<p>All watered</p>
						) : (
							<p>
								{amountToWater.length} need
								{amountToWater.length === 1 && 's'} water
							</p>
						)}
					</div>
				</div>

				<div className='ml-auto mt-auto'>
					<AvatarGroup users={users} />
				</div>
			</div>
		</div>
	);
};

export default HouseholdCard;
