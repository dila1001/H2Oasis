import { FC, ReactNode } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { baseURL } from '../api/api';
import { useAuth } from '../auth/useAuth';
import { generateInitials } from '../utils/account';
import { useHouseholds } from '../hooks/useHouseholds';

type DrawerProps = {
	children: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
	const { user } = useAuth();
	const { households } = useHouseholds();

	return (
		<div className='drawer'>
			<input id='my-drawer' type='checkbox' className='drawer-toggle' />
			<div className='drawer-content'>{children}</div>
			<div className='drawer-side'>
				<label
					htmlFor='my-drawer'
					aria-label='close sidebar'
					className='drawer-overlay'
				></label>
				<ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
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
					<div className='border-l h-[1px] bg-base-300 mb-5'></div>
					{households &&
						households.map((household) => (
							<li key={household.id}>
								<a>
									<FaHouse className='text-secondary' />
									{household.name}
								</a>
							</li>
						))}
					<li className='mt-auto'>
						<a
							href={`${baseURL}/auth/logout?returnUrl=${window.location.origin}`}
						>
							<FaSignOutAlt className='text-secondary' />
							Logout
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Drawer;
