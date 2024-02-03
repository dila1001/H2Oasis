import { useEffect, useState } from 'react';
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
	FaLocationDot,
	FaPen,
} from 'react-icons/fa6';
import { getDaysLeft, getTodaysDate } from '../../utils/dateUtils';
import toast, { Toaster } from 'react-hot-toast';
import SubmitButton from '../../components/UI/SubmitButton';
import { useAuth } from '../../auth/useAuth';

const PlantPage = () => {
	const { householdId, plantId } = useParams();
	const [searchParams] = useSearchParams();
	const [plant, setPlant] = useState<Plant | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			const saved = searchParams.get('saved');
			const created = searchParams.get('created');
			if (plantId) {
				const plant = await getPlantById(plantId);
				setPlant(plant);
				if (saved === 'true') {
					toast.success(`${plant!.name} has been successfully saved`, {
						id: 'save',
					});
				}
				if (created === 'true') {
					toast.success(`${plant!.name} has been successfully created`, {
						id: 'created',
					});
				}
			}
			setIsLoading(false);
		};
		fetchData();
	}, [plantId, searchParams]);

	const waterPlant = async () => {
		const updatedPlantData: NewPlant = {
			name: plant!.name,
			species: plant!.species,
			imageUrl: plant!.imageUrl,
			// uploadedImage: plant!.uploadedImage,
			wateringFrequencyInDays: plant!.wateringFrequencyInDays,
			lastWatered: getTodaysDate(),
			waterAmountInMl: plant!.waterAmountInMl,
			location: plant!.location,
			lastWateredBy: user!.firstName,
		};
		const response = await updatePlant(
			plant!.id,
			householdId!,
			updatedPlantData
		);
		toast.success(`${plant?.name} has been successfully watered`);
		setPlant(response);
	};

	const viewLoadingSkeleton = () => {
		return (
			<div className='flex flex-col pl-8 gap-4 w-full bg-base-200'>
				<div className='skeleton h-80 w-80 pl-12 bg-base-200'></div>
				<div className='skeleton h-16 w-44 pl-12 bg-base-200'></div>
				{[1, 2, 3, 4].map((item) => (
					<div key={item} className='skeleton w-60 h-8 bg-base-200'></div>
				))}
			</div>
		);
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

			{plant && (
				<div className='mx-5 my-2 flex-row'>
					{/* <div className='text-sm breadcrumbs'>
            <ul>
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
            </ul>
          </div> */}
					<img
						src={plant?.imageUrl}
						alt='Image Description'
						className='object-cover rounded-2xl w-full h-80 shadow-md'
					/>
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
									water in{' '}
									{getDaysLeft(
										plant?.lastWatered,
										plant?.wateringFrequencyInDays
									)}{' '}
									days
								</p>
								<p className='text-gray-500'>
									remind every {plant?.wateringFrequencyInDays} days
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
