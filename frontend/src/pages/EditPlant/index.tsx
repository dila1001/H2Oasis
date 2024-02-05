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
import { FaSeedling } from 'react-icons/fa6';
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
		formState: { errors, isSubmitting },
		reset,
	} = useForm<NewPlant>();

	useEffect(() => {
		const fetchPlant = async () => {
			const plantBeingEdited = searchParams.get('plant');
			if (plantBeingEdited) {
				const plant = await getPlantById(plantBeingEdited);
				setPlant(plant);
				if (plant) {
					reset({
						name: plant.name,
						species: plant.species,
						imageUrl: plant.imageUrl,
						location: plant.location,
						// uploadedImage: plant?.uploadedImage,
						wateringFrequencyInDays: plant.wateringFrequencyInDays.toString(),
						lastWatered: formatDate(plant.lastWatered),
						waterAmountInMl: plant.waterAmountInMl,
					});
				}
			}
		};

		fetchPlant();
	}, [reset, user, searchParams]);

	const onSubmit: SubmitHandler<NewPlant> = async (data) => {
		if (user) {
			let response;
			const updatedData = { ...data, lastWateredBy: user.firstName };
			console.log(updatedData);
			if (plant) {
				response = await updatePlant(plant.id, householdId!, updatedData);
				navigate(`/${householdId}/plants/${response?.id}?saved=true`);
			} else {
				response = await addPlant(householdId!, updatedData);
				navigate(`/${householdId}/plants/${response?.id}?created=true`);
			}

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
			<h2 className='card-title text-3xl mb-4'>
				{plant ? plant.name : 'Add New Plant'}
			</h2>
			<form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					placeholder='Name'
					className={`input input-bordered input-success w-full ${
						errors.name && 'input-error'
					}`}
					{...register('name', {
						required: 'Name is required',
					})}
				/>
				<input
					type='text'
					placeholder='Species'
					className={`input input-bordered input-success w-full ${
						errors.species && 'input-error'
					}`}
					{...register('species', {
						required: 'Species is required',
					})}
				/>
				<input
					type='date'
					className={`input input-bordered input-success w-full ${
						errors.lastWatered && 'input-error'
					}`}
					{...register('lastWatered', {
						required: 'Date is required',
						max: {
							value: new Date().toISOString().split('T')[0],
							message: 'Choose today or before.',
						},
					})}
				/>
				{errors.lastWatered && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.lastWatered.message}`}</p>
				)}
				<input
					type='text'
					placeholder='Image URL'
					className='input input-bordered input-success w-full'
					{...register('imageUrl')}
				/>
				<input
					type='text'
					placeholder='Location'
					className={`input input-bordered input-success w-full ${
						errors.location && 'input-error'
					}`}
					{...register('location', {
						required: 'Location is required',
					})}
				/>

				<input
					type='number'
					placeholder='Watering frequency in days'
					className={`input input-bordered input-success w-full ${
						errors.wateringFrequencyInDays && 'input-error'
					}`}
					{...register('wateringFrequencyInDays', {
						required: 'Watering frequency is required',
					})}
				/>

				<input
					type='number'
					placeholder='Amount of water in ml'
					className={`input input-bordered input-success w-full ${
						errors.waterAmountInMl && 'input-error'
					}`}
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
