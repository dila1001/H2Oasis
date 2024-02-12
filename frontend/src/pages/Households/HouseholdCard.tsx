import { FC } from 'react';

import {
	FaDroplet,
	FaEllipsisVertical,
	FaLeaf,
	FaPen,
	FaTrash,
} from 'react-icons/fa6';

import AvatarGroup from '../../components/UI/AvatarGroup';
import { getDaysLeft } from '../../utils/dateUtils';
import { Household } from '../../services/householdsService';
import { useAuth } from '../../auth/useAuth';

type HouseholdCardProps = {
	household: Household;
	onEdit: () => void;
	onDelete: () => void;
};

const HouseholdCard: FC<HouseholdCardProps> = ({
	household,
	onEdit,
	onDelete,
}) => {
	const { user } = useAuth();
	const amountToWater = household.plants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft <= 0;
	});

	return (
		<div className='card bg-[#f9fcf4] shadow-md mb-6 h-32 flex flex-col p-4'>
			{household.adminId === user?.id && (
				<div className='badge badge-sm badge-neutral absolute top-[-8px]'>
					Admin
				</div>
			)}
			<div className='flex items-center justify-between'>
				<h3 className='card-title'>{household.name} </h3>

				{household.adminId === user?.id && (
					<div
						className='dropdown dropdown-end dropdown-hover'
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<div tabIndex={0} role='button'>
							<FaEllipsisVertical className='text-xl text-base-300' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-[#f9fcf4] rounded-box max-w-max'
						>
							<li onClick={() => onEdit()}>
								<div>
									<FaPen className='text-base-300 mr-2' />
									Edit
								</div>
							</li>
							<li onClick={() => onDelete()}>
								<div>
									<FaTrash className='text-base-300 mr-2' />
									Delete
								</div>
							</li>
						</ul>
					</div>
				)}
			</div>
			<div className='flex flex-row grow'>
				<div className='flex flex-col mt-auto gap-2'>
					<div className='badge badge-ghost text-xs'>
						<FaLeaf className='mr-2' />
						<p>
							{household.plants.length} plant
							{household.plants.length !== 1 ? 's' : ''}
						</p>
					</div>

					<div
						className={`badge text-xs ${
							amountToWater.length > 0 && 'badge badge-secondary'
						}`}
					>
						<FaDroplet className='mr-2' />
						{household.plants.length === 0 ? (
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
					<AvatarGroup users={household.users} />
				</div>
			</div>
		</div>
	);
};

export default HouseholdCard;
