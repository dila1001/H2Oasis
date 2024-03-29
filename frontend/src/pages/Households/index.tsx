import { useEffect, useState } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeartBroken, FaHome } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
	AddUserToHousehold,
	Household,
	NewHousehold,
	createHousehold,
	deleteHousehold,
	getHousehold,
	getHouseholdsForUser,
	updateHousehold,
} from '../../services/householdsService';
import { useAuth } from '../../auth/useAuth';
import { useHouseholds } from '../../hooks/useHouseholds';
import HouseholdCard from './HouseholdCard';
import SearchBar from '../Plants/SearchBar';

const HouseholdsPage = () => {
	const { households, setHouseholds, isLoading, error } = useHouseholds();
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedHousehold, setSelectedHousehold] = useState<
		Household | undefined
	>(undefined);
	const [isEditingHousehold, setIsEditingHousehold] = useState(false);
	const [hasValue, setHasValue] = useState('');
	const [query, setQuery] = useState('');
	const [inviteHousehold, setInviteHousehold] = useState<Household | null>(
		null
	);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<{ name: string }>();

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

	useEffect(() => {
		const inviteCode = searchParams.get('inviteCode');
		const leftHousehold = searchParams.get('leftHousehold');

		if (leftHousehold) {
			toast.success(`You have successfully left ${leftHousehold}`, {
				id: 'leave-household',
			});
		}

		const fetchData = async () => {
			if (inviteCode) {
				const response = await getHousehold(inviteCode);
				setInviteHousehold(response);
				const joinHouseholdModal = document.getElementById(
					'join-household'
				) as HTMLDialogElement | null;
				if (joinHouseholdModal) {
					joinHouseholdModal.showModal();
				}
			}
			if (user) {
				const households = await getHouseholdsForUser(user.id);
				setHouseholds(households);
			}
		};

		fetchData();
	}, [searchParams, reset]);

	const onCreateHouseholdSubmit: SubmitHandler<{
		name: string;
	}> = async (data) => {
		if (user) {
			const response = await createHousehold(data.name, user.id);
			// TODO: check if successfull. if successfull, set households. otherwise, show error
			setHouseholds((prev) => [...(prev || []), response]);
		}
		closeModal('create-household');
		toast.success(`${data.name} has been successfully created`);
	};

	const closeModal = (id: string) => {
		(document.getElementById(id) as HTMLDialogElement | null)?.close();
		setSearchParams('');
		reset({
			name: '',
		});

		if (isEditingHousehold) {
			setIsEditingHousehold(false);
		}

		if (selectedHousehold) {
			setSelectedHousehold(undefined);
		}

		if (hasValue) {
			setHasValue('');
		}
	};

	const openDeleteHouseholdModal = (householdId: string) => {
		const householdToDelete = households?.find((h) => h.id === householdId);
		setSelectedHousehold(householdToDelete);
		(
			document.getElementById('delete-household') as HTMLDialogElement | null
		)?.showModal();
	};

	const openEditHouseholdModal = (householdId: string) => {
		const householdToEdit = households?.find((h) => h.id === householdId);
		setSelectedHousehold(householdToEdit);
		setIsEditingHousehold(true);
		(
			document.getElementById('create-household') as HTMLDialogElement | null
		)?.showModal();
	};

	const onEditHouseholdSubmit: SubmitHandler<NewHousehold> = async (data) => {
		if (selectedHousehold) {
			await updateHousehold(selectedHousehold.id, data);
			// TODO: check if successful. if successful, set households. otherwise, show error
			setHouseholds((prev) => {
				if (!prev) {
					return prev;
				}
				return prev.map((household) => {
					if (household.id === selectedHousehold.id) {
						return { ...household, name: data.name };
					}
					return household;
				});
			});
		}
		closeModal('create-household');
		toast.success(`${data.name} has been successfully saved`);
		setIsEditingHousehold(false);
	};

	const onDeleteHousehold = async () => {
		if (selectedHousehold && user) {
			await deleteHousehold(selectedHousehold.id);
			setHouseholds((prev) =>
				prev!.filter((h) => h.id !== selectedHousehold.id)
			);
			navigate(`/?deletedHousehold=${selectedHousehold.name}`);
		}

		toast.success(`${selectedHousehold?.name} has been successfully created`);
		setSelectedHousehold(undefined);
		closeModal('delete-household');
	};

	const joinHousehold = async () => {
		if (inviteHousehold && user) {
			await AddUserToHousehold(inviteHousehold.id, user.id);
			toast.success(`You have successfully joined ${inviteHousehold.name}`);
			const response = await getHouseholdsForUser(user.id);
			setHouseholds(response);
			setSearchParams('');
		}
	};

	const handleSearch = (searchQuery: string) => {
		setQuery(searchQuery);
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHasValue(event.target.value);
	};

	return (
		<div className='mx-5'>
			<Toaster position='top-center' reverseOrder={false} />
			{/* Modal for add household */}
			<dialog id='create-household' className='modal'>
				<div className='modal-box'>
					<button
						className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
						onClick={() => closeModal('create-household')}
					>
						✕
					</button>
					{isEditingHousehold ? (
						<h3 className='font-bold text-lg py-4'>
							Edit {selectedHousehold?.name}
						</h3>
					) : (
						<h3 className='font-bold text-lg py-4'>Create Household</h3>
					)}
					<form
						method='dialog'
						className='flex flex-col gap-3'
						onSubmit={
							isEditingHousehold
								? handleSubmit(onEditHouseholdSubmit)
								: handleSubmit(onCreateHouseholdSubmit)
						}
					>
						<input
							type='text'
							placeholder={isEditingHousehold ? 'New name' : 'Name'}
							className={`input input-bordered input-success w-full ${
								errors.name && 'input-error'
							}`}
							value={hasValue}
							{...register('name', {
								required: true,
								maxLength: {
									value: 20,
									message: 'Name must not exceed 20 characters',
								},
							})}
							onChange={handleOnChange}
						/>
						<div className='modal-action'>
							{errors.name && (
								<p className='text-error text-sm mt-[-10px] ml-2'>{`${errors.name.message}`}</p>
							)}
							<button className='btn' disabled={!hasValue || isSubmitting}>
								{isEditingHousehold ? 'Submit' : 'Create'}
							</button>
						</div>
					</form>
				</div>
			</dialog>

			{/* Modal for join household */}
			<dialog id='join-household' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>
						You have been invited to join {inviteHousehold?.name}
					</h3>
					<p className='py-4'>Would you like to join this household?</p>
					<div className='modal-action'>
						<form method='dialog' className='w-full flex gap-2 justify-end'>
							<button
								onClick={() => closeModal('join-household')}
								className='btn'
							>
								No
							</button>
							<button
								className='btn bg-accent text-white'
								onClick={() => joinHousehold()}
							>
								Yes
							</button>
						</form>
					</div>
				</div>
			</dialog>

			{/* Modal for delete household */}
			<dialog id='delete-household' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg py-4'>
						Are you sure you want to delete {selectedHousehold?.name}?
					</h3>
					<form method='dialog' className='w-full flex gap-2 justify-end'>
						<button
							className='btn'
							onClick={() => closeModal('delete-household')}
						>
							No
						</button>
						<button
							className='btn bg-accent text-white'
							onClick={() => onDeleteHousehold()}
						>
							Yes
						</button>
					</form>
				</div>
			</dialog>

			{!error && (
				<div className='mb-6'>
					<SearchBar onSearch={handleSearch} />
				</div>
			)}

			{/* Check for loading state */}
			{isLoading && viewLoadingSkeleton()}

			{/* Check for error state */}
			{error && (
				<div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6'>
					<FaHeartBroken className='text-warning text-[120px]' />
					<h1 className='card-title text-neutral text-center'>
						An error occured while fetching households.
						<br />
					</h1>
					<p className='mb-12'>Please try again later.</p>
				</div>
			)}

			{/* Check for empty state */}
			{households && households.length === 0 && !isLoading && !error && (
				<div className='flex flex-col items-center justify-center h-[calc(100vh-220px)] gap-6'>
					<FaHome className='text-warning text-[120px]' />
					<h1 className='card-title text-neutral mb-12 text-center'>
						You are not a part of any households.
					</h1>
					<button
						className='btn btn-neutral'
						onClick={() =>
							(
								document.getElementById(
									'create-household'
								) as HTMLDialogElement | null
							)?.showModal()
						}
					>
						Create a household
					</button>
				</div>
			)}

			{/* Render households */}
			<div className='mb-24'>
				{households &&
					!isLoading &&
					!error &&
					households
						.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
						.map((h) => (
							<Link to={`/${h.id}/plants`} key={h.id}>
								<HouseholdCard
									// householdName={h.name}
									// plants={h.plants}
									// users={h.users}
									household={h}
									onDelete={() => openDeleteHouseholdModal(h.id)}
									onEdit={() => openEditHouseholdModal(h.id)}
								/>
							</Link>
						))}
			</div>

			{households && !isLoading && !error && households.length !== 0 && (
				<div className='fixed bottom-4 right-0 left-0 flex'>
					<button
						className='bg-secondary rounded-full p-3 flex justify-center w-full mx-5 shadow-md'
						onClick={() =>
							(
								document.getElementById(
									'create-household'
								) as HTMLDialogElement | null
							)?.showModal()
						}
					>
						<FaPlus className='text-white text-2xl' />
					</button>
				</div>
			)}
		</div>
	);
};

export default HouseholdsPage;
