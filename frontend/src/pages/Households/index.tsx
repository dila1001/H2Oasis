import { useEffect } from 'react';
import {
	AddUserToHousehold,
	getHouseholdsForUser,
} from '../../services/householdsService';
import { useAuth } from '../../auth/useAuth';
import { Link, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHouseholds } from '../../hooks/useHouseholds';
import AvatarGroup from '../../components/UI/AvatarGroup';

const HouseholdsPage = () => {
	const { households, setHouseholds } = useHouseholds();
	const { user } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm<{ householdId: string }>();

	useEffect(() => {
		const inviteCode = searchParams.get('inviteCode');

		//TODO: need modal, button and form for create household

		if (inviteCode) {
			const addHouseholdModal = document.getElementById(
				'add-household'
			) as HTMLDialogElement | null;
			if (addHouseholdModal) {
				addHouseholdModal.showModal();
			}
			reset({
				householdId: inviteCode,
			});
		}
	}, [searchParams, reset]);

	const onAddHouseholdSubmit: SubmitHandler<{
		householdId: string;
	}> = async (data) => {
		await AddUserToHousehold(data.householdId, user!.id);
		// TODO: check if successfull. if successfull, set households. otherwise, show error
		const updatedHouseholds = await getHouseholdsForUser(user!.id);
		if (updatedHouseholds) {
			setHouseholds(updatedHouseholds);
		}

		closeModal('add-household');
	};

	const closeModal = (id: string) => {
		(document.getElementById(id) as HTMLDialogElement | null)?.close();
		setSearchParams('');
		reset({
			householdId: '',
		});
	};

	return (
		<div className='mx-5'>
			{/* Modal for add household */}
			<dialog id='add-household' className='modal'>
				<div className='modal-box'>
					<button
						className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
						onClick={() => closeModal('add-household')}
					>
						✕
					</button>
					<h3 className='font-bold text-lg py-4'>Add Household</h3>
					<form
						method='dialog'
						className='flex flex-col gap-3'
						onSubmit={handleSubmit(onAddHouseholdSubmit)}
					>
						<input
							type='text'
							placeholder='Household ID'
							className='input input-bordered input-success w-full'
							{...register('householdId', {
								required: 'Household ID is required',
							})}
						/>
						<div className='modal-action'>
							<button className='btn' disabled={isSubmitting}>
								Add
							</button>
						</div>
					</form>
				</div>
			</dialog>
			<button
				className='btn btn-primary'
				onClick={() =>
					(
						document.getElementById('add-household') as HTMLDialogElement | null
					)?.showModal()
				}
			>
				Add household
			</button>

			<h2 className='font-bold'>Households of {user?.firstName}</h2>
			{households?.map((h) => (
				<div key={h.id}>
					<Link to={`/${h.id}/plants`}>{h.name}</Link>
					<AvatarGroup users={h.users} />
				</div>
			))}
		</div>
	);
};

export default HouseholdsPage;
