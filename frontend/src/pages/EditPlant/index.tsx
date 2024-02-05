import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
	NewPlant,
	Plant,
	addPlant,
	getPlantById,
	updatePlant,
} from '../../services/plantsService';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaSeedling, FaTrash } from 'react-icons/fa6';
import { Toaster } from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtils';
import SubmitButton from '../../components/UI/SubmitButton';
import { useAuth } from '../../auth/useAuth';
import { getHouseholdsForUser } from '../../services/householdsService';
import { useHouseholds } from '../../hooks/useHouseholds';

const EditPlant = () => {
	const [searchParams] = useSearchParams();
	const { householdId } = useParams();
	const [plant, setPlant] = useState<Plant | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();
	const { setHouseholds } = useHouseholds();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm<NewPlant>();

	useEffect(() => {
		const fetchPlant = async () => {
			const queryValue = searchParams.get('plant');
			if (queryValue) {
				const plant = await getPlantById(queryValue);
				setPlant(plant);
				if (plant && user) {
					reset({
						name: plant.name,
						species: plant.species,
						imageUrl: plant.imageUrl,
						location: plant.location,
						// uploadedImage: plant?.uploadedImage,
						wateringFrequencyInDays: plant.wateringFrequencyInDays.toString(),
						lastWatered: formatDate(plant.lastWatered),
						waterAmountInMl: plant.waterAmountInMl,
						lastWateredBy: user.firstName,
					});
				}
			}
		};
		if (!searchParams.get('plant')) {
			fetchPlant();
		}
	}, [reset, user]);

	const onSubmit: SubmitHandler<NewPlant> = async (data) => {
		let response;
		if (plant) {
			response = await updatePlant(plant.id, householdId!, data);
			navigate(`/${householdId}/plants/${response?.id}?saved=true`);
		} else {
			response = await addPlant(householdId!, data);
			navigate(`/${householdId}/plants/${response?.id}?created=true`);
		}

		if (user) {
			const households = await getHouseholdsForUser(user.id);
			setHouseholds(households);
		}
	};

	return (
		<div className='mx-5 my-2 flex flex-col gap-4'>
			<Toaster
				position='top-center'
				reverseOrder={false}
				toastOptions={{
					success: {
						duration: 4000,
					},
				}}
			/>
			<div className='flex '>
				<h2 className='card-title text-3xl mb-4'>
					{plant ? plant.name : 'Add New Plant'}
				</h2>

				{plant && (
					<button>
						<FaTrash />
					</button>
				)}
			</div>

			<form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					placeholder='Name'
					className='input input-bordered input-success w-full'
					{...register('name', {
						required: 'Name is required',
					})}
				/>
				<input
					type='text'
					placeholder='Species'
					className='input input-bordered input-success w-full'
					{...register('species', {
						required: 'Species is required',
					})}
				/>
				<input
					type='date'
					className='input input-bordered input-success w-full'
					{...register('lastWatered', {
						required: 'Date is required',
					})}
				/>
				<input
					type='text'
					placeholder='Image URL'
					className='input input-bordered input-success w-full'
					{...register('imageUrl')}
				/>
				<input
					type='text'
					placeholder='Location'
					className='input input-bordered input-success w-full'
					{...register('location')}
				/>

				<input
					type='number'
					placeholder='Watering frequency in days'
					className='input input-bordered input-success w-full'
					{...register('wateringFrequencyInDays', {
						required: 'Watering frequency is required',
					})}
				/>

				<input
					type='number'
					placeholder='Amount of water in ml'
					className='input input-bordered input-success w-full mb-8'
					{...register('waterAmountInMl', {
						required: 'Water amount is required',
					})}
				/>

				{/* upload image */}
				{/* <input
					id='plantImage'
					type='file'
					className='block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-none file:text-sm
        file:bg-warning
        file:h-12'
					accept='image/png, image/jpeg'
					{...register('uploadedImage', {
						required: 'Image is required',
					})}
				/> */}

				{/* Previous working code */}
				{/* <div className='p-4 my-4'>
          <button
            className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'
            type='submit'
            disabled={isSubmitting}
          >
            <FaSeedling className='text-white text-2xl' />
          </button>
        </div> */}

				<SubmitButton
					iconName={FaSeedling}
					formState={isSubmitting}
					buttonType='submit'
				/>
			</form>
		</div>
	);
};

export default EditPlant;
