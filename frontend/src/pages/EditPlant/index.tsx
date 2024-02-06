import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
	NewPlant,
	Plant,
	addPlant,
	deletePlant,
	getPlantById,
	updatePlant,
} from '../../services/plantsService';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { FaSeedling, FaTrash } from 'react-icons/fa6';
import { Toaster } from 'react-hot-toast';
import { formatDate } from '../../utils/dateUtils';
import SubmitButton from '../../components/UI/SubmitButton';
import { useAuth } from '../../auth/useAuth';
import { getHouseholdsForUser } from '../../services/householdsService';
import { useHouseholds } from '../../hooks/useHouseholds';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditPlant = () => {
	const [searchParams] = useSearchParams();
	const { householdId } = useParams();
	const [plant, setPlant] = useState<Plant | null>(null);
	const navigate = useNavigate();
	const { user } = useAuth();
	const { setHouseholds } = useHouseholds();

	const plantBeingEdited = searchParams.get('plant');
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		control,
	} = useForm<NewPlant>();

	useEffect(() => {
		const fetchPlant = async () => {
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

	const deletePlantFromHousehold = async () => {
		if (plantBeingEdited) {
			await deletePlant(plantBeingEdited);
			navigate(`/${householdId}/plants/?deletedPlant=${plant?.name}`);
		}
	};

	const closeModal = (id: string) => {
		(document.getElementById(id) as HTMLDialogElement | null)?.close();
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

			{/* Delete plant modal */}
			<dialog id='delete-plant' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg py-4'>
						Are you sure you want to delete {plant?.name}?
					</h3>
					<form method='dialog' className='w-full flex gap-2 justify-end'>
						<button
							className='btn bg-accent text-white'
							onClick={() => deletePlantFromHousehold()}
						>
							Yes
						</button>
						<button className='btn' onClick={() => closeModal('delete-plant')}>
							No
						</button>
					</form>
				</div>
			</dialog>

			<div className='flex items-center gap-3 mb-4'>
				{plant ? (
					<>
						<h2 className='card-title text-3xl'>{plant.name}</h2>
						<button
							onClick={() =>
								(
									document.getElementById(
										'delete-plant'
									) as HTMLDialogElement | null
								)?.showModal()
							}
						>
							<FaTrash className='text-base-300' />
						</button>
					</>
				) : (
					<h2 className='card-title text-3xl'>Add New Plant</h2>
				)}
			</div>

			<form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					placeholder='Name'
					className={`input input-bordered input-success w-full ${
						errors.name && 'input-error'
					}`}
					{...register('name', {
						required: 'Name is required',
						maxLength: {
							value: 20,
							message: 'Name must not exceed 20 characters',
						},
					})}
				/>
				{errors.name && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.name.message}`}</p>
				)}

				<input
					type='text'
					placeholder='Species'
					className={`input input-bordered input-success w-full ${
						errors.species && 'input-error'
					}`}
					{...register('species', {
						required: 'Species is required',
						maxLength: {
							value: 30,
							message: 'Species must not exceed 30 characters',
						},
					})}
				/>
				{errors.species && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.species.message}`}</p>
				)}

				{/* working code */}
				{/* <input
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
				/> */}

				{/* TODO: required isnt working, db is registering the day before when saving */}
				<Controller
					name='lastWatered'
					control={control}
					rules={{ required: 'Last watered date is required' }}
					render={({ field }) => {
						return (
							<div className='flex items-center'>
								<DatePicker
									{...field}
									className='input input-bordered input-success '
									selected={field.value ? new Date(field.value) : null}
									onChange={(date) => {
										field.onChange(date);
									}}
									dateFormat='dd-MMM-yyyy'
									placeholderText='Last watered date'
								/>
								<div className='pl-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 448 512'
										className='w-5 h-5'
									>
										<path d='M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z' />
									</svg>
								</div>
							</div>
						);
					}}
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
						maxLength: {
							value: 20,
							message: 'Location must not exceed 20 characters',
						},
					})}
				/>
				{errors.location && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.location.message}`}</p>
				)}

				<input
					type='number'
					placeholder='Watering frequency in days'
					className={`input input-bordered input-success w-full ${
						errors.wateringFrequencyInDays && 'input-error'
					}`}
					{...register('wateringFrequencyInDays', {
						required: 'Watering frequency is required',
						min: {
							value: 0,
							message: 'Please enter a valid number',
						},
					})}
				/>
				{errors.wateringFrequencyInDays && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.wateringFrequencyInDays.message}`}</p>
				)}

				<input
					type='number'
					placeholder='Amount of water in ml'
					className={`input input-bordered input-success w-full mb-8 ${
						errors.waterAmountInMl && 'input-error'
					}`}
					{...register('waterAmountInMl', {
						required: 'Water amount is required',
						min: {
							value: 0,
							message: 'Please enter a valid number',
						},
					})}
				/>
				{errors.waterAmountInMl && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.waterAmountInMl.message}`}</p>
				)}

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
