import { useEffect, useState } from 'react';
import {
	AddUserToHousehold,
	Household,
	createHousehold,
	getHousehold,
	getHouseholdsForUser,
} from '../../services/householdsService';
import { useAuth } from '../../auth/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHouseholds } from '../../hooks/useHouseholds';
import HouseholdCard from './HouseholdCard';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeartBroken, FaHome } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

const HouseholdsPage = () => {
	const { households, setHouseholds, isLoading, error } = useHouseholds();
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm<{ householdName: string }>();
	const [inviteHousehold, setInviteHousehold] = useState<Household | null>(
		null
	);

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

		//TODO: need modal, button and form for create household
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
		};

		fetchData();
	}, [searchParams, reset]);

	const onCreateHouseholdSubmit: SubmitHandler<{
		householdName: string;
	}> = async (data) => {
		if (user) {
			const response = await createHousehold(data.householdName, user.id);
			// TODO: check if successfull. if successfull, set households. otherwise, show error
			setHouseholds((prev) => [...(prev || []), response]);
		}
		closeModal('create-household');
		toast.success(`${data.householdName} has been successfully created`);
	};

	const closeModal = (id: string) => {
		(document.getElementById(id) as HTMLDialogElement | null)?.close();
		setSearchParams('');
		reset({
			householdName: '',
		});
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
					<h3 className='font-bold text-lg py-4'>Create Household</h3>
					<form
						method='dialog'
						className='flex flex-col gap-3'
						onSubmit={handleSubmit(onCreateHouseholdSubmit)}
					>
						<input
							type='text'
							placeholder='Name'
							className='input input-bordered input-success w-full'
							{...register('householdName', {
								required: 'Household name is required',
							})}
						/>
						<div className='modal-action'>
							<button className='btn' disabled={isSubmitting}>
								Create
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
								className='btn bg-accent text-white'
								onClick={() => joinHousehold()}
							>
								Yes
							</button>
							<button
								onClick={() => closeModal('join-household')}
								className='btn'
							>
								No
							</button>
						</form>
					</div>
				</div>
			</dialog>

			<h2 className='card-title my-6'>My Households</h2>

			{/* Check for loading state */}
			{isLoading && viewLoadingSkeleton()}

			{/* Check for error state */}
			{error && (
				<div className='flex flex-col items-center justify-center h-[calc(100vh-220px)] gap-6'>
					<FaHeartBroken className='text-warning text-[120px]' />
					<h1 className='card-title text-neutral mb-12 text-center'>
						An error occured while fetching households.
						<br />
					</h1>
					{/* <Link to={`/`}>
						<button className='btn btn-neutral'>Try again later</button>
					</Link> */}
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
			{households &&
				!isLoading &&
				!error &&
				households.map((h) => (
					<Link to={`/${h.id}/plants`} key={h.id}>
						<HouseholdCard
							householdName={h.name}
							plants={h.plants}
							users={h.users}
						/>
					</Link>
				))}
			<div className='my-12'>
				<button
					className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'
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
		</div>
	);
};

export default HouseholdsPage;
