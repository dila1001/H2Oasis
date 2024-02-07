import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
	NewPlant,
	Plant,
	getPlantById,
	updatePlant,
} from '../../services/plantsService';
import {
	FaCalendar,
	FaDroplet,
	FaHandHoldingDroplet,
	FaLeaf,
	FaLocationDot,
	FaPen,
} from 'react-icons/fa6';
import { getDaysLeft, getTodaysDate } from '../../utils/dateUtils';
import toast, { Toaster } from 'react-hot-toast';
import SubmitButton from '../../components/UI/SubmitButton';
import { useAuth } from '../../auth/useAuth';
import { FaHeartBroken } from 'react-icons/fa';
import { useHouseholds } from '../../hooks/useHouseholds';

const PlantPage = () => {
	const { householdId, plantId } = useParams();
	const [searchParams] = useSearchParams();
	const [plant, setPlant] = useState<Plant | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);
	const { user } = useAuth();
	const { households, setHouseholds } = useHouseholds();
	const isCreatedToastTriggered = useRef(false);
	const isSavedToastTriggered = useRef(false);

	useEffect(() => {
		const fetchData = async () => {
			const saved = searchParams.get('saved');
			const created = searchParams.get('created');

			try {
				if (plantId) {
					const plant = await getPlantById(plantId);
					setPlant(plant);
					if (saved === 'true' && !isSavedToastTriggered.current) {
						toast.success(`${plant!.name} has been successfully saved`, {
							id: 'save',
						});
						isSavedToastTriggered.current = true;
					}
					if (created === 'true' && !isCreatedToastTriggered.current) {
						toast.success(`${plant!.name} has been successfully created`, {
							id: 'created',
						});
						isCreatedToastTriggered.current = true;
					}
				}
			} catch (error) {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [plantId, searchParams, households]);

	const waterPlant = async () => {
		if (plant && user && householdId) {
			const updatedPlantData: NewPlant = {
				name: plant.name,
				species: plant.species,
				imageUrl: plant.imageUrl,
				wateringFrequencyInDays: plant.wateringFrequencyInDays,
				lastWatered: getTodaysDate(),
				waterAmountInMl: plant.waterAmountInMl,
				location: plant.location,
				lastWateredBy: user.firstName,
			};
			const updatedPlant = await updatePlant(
				plant.id,
				householdId,
				updatedPlantData
			);

			if (updatedPlant) {
				setHouseholds((prevHouseholds) => {
					if (!prevHouseholds) return prevHouseholds;

					return prevHouseholds.map((household) => {
						if (
							household.plants.find((plant) => plant.id === updatedPlant.id)
						) {
							const updatedPlants = household.plants.map((plant) =>
								plant.id === updatedPlant.id ? updatedPlant : plant
							);
							return { ...household, plants: updatedPlants };
						}

						return household;
					});
				});
			}

			toast.success(`${plant?.name} has been successfully watered`);
		}
	};

	const viewLoadingSkeleton = () => {
		return (
			<div className='flex-col mx-5 my-2 space-y-4'>
				<div className='skeleton h-80 w-full bg-base-200 mb-8'></div>
				<div className='skeleton h-16 w-44 bg-base-200 !mb-8'></div>
				{[1, 2, 3].map((item) => (
					<div key={item} className='skeleton w-60 h-8 bg-base-200'></div>
				))}
			</div>
		);
	};

	const wateringInfo = (lastWatered: string, waterFreq: string) => {
		const daysLeft = getDaysLeft(lastWatered, waterFreq);
		if (daysLeft < 0) {
			return `late by ${Math.abs(daysLeft)} day${
				Math.abs(daysLeft) !== 1 ? 's' : ''
			}`;
		} else if (daysLeft === 0) {
			return `water today`;
		} else {
			return `in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
		}
	};

	return (
		<>
			<Toaster position='top-center' reverseOrder={false} />
			<dialog id='water-modal' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>
						Would you like to water {plant?.name}?
					</h3>
					<p className='py-4'>Press yes to water or no to close</p>
					<div className='modal-action'>
						<form method='dialog' className='w-full flex gap-2 justify-end'>
							<button
								className='btn bg-accent text-white'
								onClick={() => waterPlant()}
							>
								Yes
							</button>
							<button className='btn'>No</button>
						</form>
					</div>
				</div>
			</dialog>
			{isLoading && viewLoadingSkeleton()}

			{/* Check for error state */}
			{error && (
				<div className='flex flex-col items-center justify-center h-[calc(100vh-220px)] gap-6'>
					<FaHeartBroken className='text-warning text-[120px]' />
					<h1 className='card-title text-neutral mb-12 text-center'>
						An error occured while fetching plant
					</h1>
					<Link to={`/`}>
						<button className='btn btn-neutral'>Go home</button>
					</Link>
				</div>
			)}

			{plant && (
				<div className='mx-5 my-2 flex-row'>
					{plant.imageUrl ? (
						<img
							src={plant?.imageUrl}
							alt='Image Description'
							className='object-cover rounded-2xl w-full h-80 shadow-md'
						/>
					) : (
						<div className='rounded-2xl w-full h-80 shadow-md bg-base-200 flex items-center justify-center'>
							<FaLeaf className='text-base-100 text-7xl' />
						</div>
					)}
					<div className='p-4 my-4'>
						<div className='flex items-center gap-3'>
							<h2 className='card-title text-3xl mb-1'>{plant?.name}</h2>
							<Link to={`/${householdId}/plants/edit-plant?plant=${plant?.id}`}>
								<FaPen className='text-base-300' />
							</Link>
						</div>

						<p className='text-gray-500'>{plant?.species}</p>
					</div>
					<div className='p-4 my-4 flex flex-col gap-4'>
						<div className='flex items-center gap-2'>
							<FaDroplet className='text-4xl text-success' />
							<div className='flex flex-col'>
								<p className='text-success font-bold'>
									{plant?.waterAmountInMl}ml
								</p>
								<p className='text-gray-500'>amount of water</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<FaCalendar className='text-4xl text-success' />
							<div className='flex flex-col'>
								<p className='text-success font-bold'>
									{wateringInfo(
										plant.lastWatered,
										plant.wateringFrequencyInDays
									)}
								</p>
								<p className='text-gray-500'>
									water every {plant?.wateringFrequencyInDays} day
									{parseInt(plant?.wateringFrequencyInDays, 10) !== 1
										? 's'
										: ''}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<FaLocationDot className='text-4xl text-success' />
							<div className='flex flex-col'>
								<p className='text-success font-bold'>{plant?.location}</p>
								<p className='text-gray-500'>location</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<FaHandHoldingDroplet className='text-4xl text-success' />
							<div className='flex flex-col'>
								<p className='text-success font-bold'>{plant?.lastWateredBy}</p>
								<p className='text-gray-500'>last watered by</p>
							</div>
						</div>
					</div>

					<div className='p-4 my-4'>
						{/* Previous working code */}
						{/* <button
							className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'
							onClick={() =>
								(
									document.getElementById(
										'water-modal'
									) as HTMLDialogElement | null
								)?.showModal()
							}
						>
							<FaDroplet className='text-white text-2xl' />
						</button> */}

						<SubmitButton
							iconName={FaDroplet}
							buttonType='button'
							onClick={() =>
								(
									document.getElementById(
										'water-modal'
									) as HTMLDialogElement | null
								)?.showModal()
							}
						/>
					</div>
					{/* <Link to='/plants'>
        <div className='p-4 my-4 flex items-center gap-2 text-base-300 '>
          <FaArrowAltCircleLeft />
          <span>Back</span>
        </div>
      </Link> */}
				</div>
			)}
		</>
	);
};

export default PlantPage;
