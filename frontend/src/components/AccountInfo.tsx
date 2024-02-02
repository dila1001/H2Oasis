import { useAuth } from '../auth/useAuth';
import { generateInitials } from '../utils/account';

const AccountInfo = () => {
	const { user } = useAuth();
	return (
		<div className='flex gap-4 py-5'>
			{user && (
				<div className='avatar placeholder'>
					<div className='bg-neutral text-neutral-content rounded-full w-16'>
						<span className='text-xl'>{generateInitials(user)}</span>
					</div>
				</div>
			)}

			<div className='flex flex-col justify-center'>
				{user && (
					<>
						<p className='card-title'>
							{user.firstName} {user.lastName}
						</p>
						<p>{user.email}</p>
					</>
				)}
			</div>
		</div>
	);
};

export default AccountInfo;
