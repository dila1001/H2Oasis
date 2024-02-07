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

	const plantBeingEdited = searchParams.get('plant');
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
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
						location: plant.location,
						wateringFrequencyInDays: plant.wateringFrequencyInDays.toString(),
						lastWatered: formatDate(plant.lastWatered),
						waterAmountInMl: plant.waterAmountInMl,
					});
				}
			}
		};

		fetchPlant();
	}, [reset, user, searchParams]);

	const onSubmit: SubmitHandler<NewPlant> = async (data: NewPlant) => {
		if (user) {
			let response;
			if (plant) {
				const updatedData = { ...data, imageUrl: plant.imageUrl };
				response = await updatePlant(plant.id, householdId!, updatedData, user);
				navigate(`/${householdId}/plants/${response?.id}?saved=true`);
			} else {
				response = await addPlant(householdId!, data, user);
				navigate(`/${householdId}/plants/${response?.id}?created=true`);
			}

			const households = await getHouseholdsForUser(user.id);
			setHouseholds(households);
		}
	};

	const deletePlantFromHousehold = async () => {
		if (plantBeingEdited && user) {
			await deletePlant(plantBeingEdited);
			navigate(`/${householdId}/plants/?deletedPlant=${plant?.name}`);
			const households = await getHouseholdsForUser(user.id);
			setHouseholds(households);
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

			<div className='flex items-center gap-3'>
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

			<form
				className='flex flex-col gap-3 w-full'
				onSubmit={handleSubmit(onSubmit)}
			>
				<label className='form-control w-full'>
					<div className='label'>
						<span className='label-text'>Name</span>
					</div>
					<input
						type='text'
						placeholder='Name'
						className={`input input-bordered input-success w-full ${
							errors.name && 'input-error'
						}`}
						{...register('name', {
							required: true,
							maxLength: {
								value: 20,
								message: 'Name must not exceed 20 characters',
							},
						})}
					/>
				</label>
				{errors.name && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.name.message}`}</p>
				)}

				<label className='form-control w-full'>
					<div className='label'>
						<span className='label-text'>Species</span>
					</div>
					<input
						type='text'
						placeholder='Species'
						className={`input input-bordered input-success ${
							errors.species && 'input-error'
						}`}
						{...register('species', {
							required: true,
							maxLength: {
								value: 30,
								message: 'Species must not exceed 30 characters',
							},
						})}
					/>
				</label>
				{errors.species && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.species.message}`}</p>
				)}

				<label className='form-control w-full'>
					<div className='label'>
						<span className='label-text'>Last watered date</span>
					</div>
					<input
						type='date'
						className={`input input-bordered input-success w-full ${
							errors.lastWatered && 'input-error'
						}`}
						{...register('lastWatered', {
							required: true,
							max: {
								value: new Date().toISOString().split('T')[0],
								message: 'Choose today or before.',
							},
						})}
					/>
				</label>
				{errors.lastWatered && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.lastWatered.message}`}</p>
				)}

				<label className='form-control w-full'>
					<div className='label'>
						<span className='label-text'>Image</span>
						<span className='label-text-alt'>Optional</span>
					</div>
					<input
						type='file'
						{...register('image')}
						className='file-input file-input-bordered file-input-sm file-input-success w-full'
						accept='image/jpeg, image/png'
					/>
				</label>

				<label className='form-control w-full'>
					<div className='label'>
						<span className='label-text'>Location</span>
					</div>
					<input
						type='text'
						placeholder='Location'
						className={`input input-bordered input-success w-full ${
							errors.location && 'input-error'
						}`}
						{...register('location', {
							required: true,
							maxLength: {
								value: 20,
								message: 'Location must not exceed 20 characters',
							},
						})}
					/>
				</label>
				{errors.location && (
					<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.location.message}`}</p>
				)}

				<div className='flex gap-4 w-full'>
					<div>
						<label className='form-control w-full'>
							<div className='label'>
								<span className='label-text'>Watering frequency</span>
							</div>
							<input
								type='number'
								placeholder='In days'
								className={`input input-bordered input-success w-full ${
									errors.wateringFrequencyInDays && 'input-error'
								}`}
								{...register('wateringFrequencyInDays', {
									required: true,
									min: {
										value: 0,
										message: 'Please enter a valid number',
									},
								})}
							/>
						</label>
						{errors.wateringFrequencyInDays && (
							<p className='text-error text-sm ml-2'>{`${errors.wateringFrequencyInDays.message}`}</p>
						)}
					</div>

					<div className='grow-1'>
						<label className='form-control w-full'>
							<div className='label'>
								<span className='label-text'>Amount of water</span>
							</div>
							<input
								type='number'
								placeholder='In ml'
								className={`input input-bordered input-success w-full ${
									errors.waterAmountInMl && 'input-error'
								}`}
								{...register('waterAmountInMl', {
									required: true,
									min: {
										value: 0,
										message: 'Please enter a valid number',
									},
								})}
							/>
						</label>
						{errors.waterAmountInMl && (
							<p className='text-error text-sm ml-2'>{`${errors.waterAmountInMl.message}`}</p>
						)}
					</div>
				</div>
				<div className='mt-8'>
					<SubmitButton
						iconName={FaSeedling}
						formState={isSubmitting}
						buttonType='submit'
					/>
				</div>
			</form>
		</div>
	);
};

export default EditPlant;
