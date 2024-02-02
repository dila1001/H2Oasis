import { useEffect, useState } from 'react';
import { Plant, getPlants } from '../../services/plantsService';
import SearchBar from './SearchBar';
import PlantCard from './PlantCard';
import { Link, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';
import { getDaysLeft } from '../../utils/dateUtils';
import QRCode from 'react-qr-code';
import { getHousehold } from '../../services/householdsService';

const PlantsPage = () => {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [householdName, setHouseholdName] = useState<string>('');
	const { householdId } = useParams();

	useEffect(() => {
		// modal that shows qr code. this is triggered by "Invite user to household" btn

		const fetchData = async () => {
			if (householdId) {
				const plants = await getPlants(householdId);
				await getHousehold(householdId).then((name) => {
					setHouseholdName(name!.name);
				});
				if (plants) {
					setPlants(plants);
				}
			}
			setIsLoading(false);
		};
		fetchData();
	}, []);

	const sortedPlants = [...plants].sort((a, b) => {
		const daysLeftA = getDaysLeft(a.lastWatered, a.wateringFrequencyInDays);
		const daysLeftB = getDaysLeft(b.lastWatered, b.wateringFrequencyInDays);

		return daysLeftA - daysLeftB;
	});

	const viewLoadingSkeleton = () => {
		return (
			<div>
				{[1, 2, 3, 4].map((item) => (
					<div
						key={item}
						className='skeleton w-full h-32 my-6 bg-base-200'
					></div>
				))}
			</div>
		);
	};

	const QRCodeValue = `${window.location.origin}?inviteCode=${householdId}`;

	return (
		<>
			<div className='mx-5'>
				<h3 className='font-bold text-lg'>{householdName} plants</h3>
				<dialog id='show-qrcode' className='modal'>
					<div className='modal-box'>
						<form method='dialog'>
							<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
								✕
							</button>
						</form>
						{/* <h3 className='font-bold text-lg text-center'>
							Invite a user to your Household
						</h3> */}
						<div className='py-4 flex justify-center'>
							<QRCode value={QRCodeValue} />
						</div>
						<p className='text-center'>
							Share this QR code with your friend/family
						</p>
					</div>
				</dialog>
				<SearchBar />
				<button
					className='btn btn-primary'
					onClick={() =>
						(
							document.getElementById('show-qrcode') as HTMLDialogElement | null
						)?.showModal()
					}
				>
					Invite user to household
				</button>
				{isLoading && viewLoadingSkeleton()}

				{sortedPlants.map((plant) => (
					<Link to={`/${householdId}/plants/${plant.id}`} key={plant.id}>
						<PlantCard
							name={plant.name}
							species={plant.species}
							imageUrl={plant.imageUrl}
							lastWatered={plant.lastWatered}
							waterFrequency={plant.wateringFrequencyInDays}
							// uploadedImage={undefined}
						/>
					</Link>
				))}

				<div className='my-8'>
					<Link to={`/${householdId}/plants/edit-plant`}>
						<button className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'>
							<FaPlus className='text-white text-2xl' />
						</button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default PlantsPage;
