import { FC } from 'react';
import { getDaysLeft, getPercentage } from '../../utils/dateUtils';
import { FaDroplet } from 'react-icons/fa6';

type PlantCardProps = {
	name: string;
	species: string;
	imageUrl: string;
	lastWatered: string;
	waterFrequency: string;
	onClick?: () => void;
};

const PlantCard: FC<PlantCardProps> = ({
	name,
	species,
	imageUrl,
	lastWatered,
	waterFrequency,
	onClick,
}) => {
	const radialProgressStyle: Record<string, string> = {
		'--value': `${getPercentage(
			getDaysLeft(lastWatered, waterFrequency),
			waterFrequency
		)}`,
	};

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onClick) {
			onClick();
		}
	};

	return (
		<div className='card bg-[#f9fcf4] shadow-md mb-6 flex-row h-32'>
			<div className='max-h-48 w-1/4 overflow-hidden rounded-tl-2xl rounded-bl-2xl'>
				<img className='w-full h-full object-cover' src={imageUrl} alt={name} />
			</div>
			<div className='card-body p-4 flex-1 flex-row'>
				<div>
					{' '}
					<h3 className='card-title'>{name}</h3>
					<p className='text-gray-500'>{species}</p>
				</div>

				<div className='card-actions flex justify-end ml-auto items-center'>
					{getDaysLeft(lastWatered, waterFrequency) === 0 ||
					getDaysLeft(lastWatered, waterFrequency) <= 0 ? (
						<div
							className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center'
							onClick={handleClick}
						>
							<FaDroplet className='text-white text-2xl' />
						</div>
					) : (
						<div
							className='radial-progress text-success'
							style={radialProgressStyle}
							role='progressbar'
						>
							{getDaysLeft(lastWatered, waterFrequency)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PlantCard;
