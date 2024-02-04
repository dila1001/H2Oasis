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

const HouseholdsPage = () => {
	const { households, setHouseholds } = useHouseholds();
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
							placeholder='Household Name'
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
						You have been invited to join {inviteHousehold?.name}?
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

			<button
				className='btn btn-primary'
				onClick={() =>
					(
						document.getElementById(
							'create-household'
						) as HTMLDialogElement | null
					)?.showModal()
				}
			>
				Create household
			</button>

			<h2 className='font-bold'>Households of {user?.firstName}</h2>

			{households?.map((h) => (
				<Link to={`/${h.id}/plants`} key={h.id}>
					<HouseholdCard
						householdName={h.name}
						plants={h.plants}
						users={h.users}
					/>
				</Link>
			))}
		</div>
	);
};

export default HouseholdsPage;
