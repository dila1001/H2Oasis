import { FC, ReactNode, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { baseURL } from '../api/api';
import { useAuth } from '../auth/useAuth';
import { useHouseholds } from '../hooks/useHouseholds';
import { Link } from 'react-router-dom';
import Avatar from './UI/Avatar';

type DrawerProps = {
	children: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
	const { user } = useAuth();
	const { households } = useHouseholds();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	return (
		<div className='drawer'>
			<input
				id='my-drawer'
				type='checkbox'
				className='drawer-toggle'
				checked={isDrawerOpen}
				onChange={toggleDrawer}
			/>
			<div className='drawer-content'>{children}</div>
			<div className='drawer-side'>
				<label
					htmlFor='my-drawer'
					aria-label='close sidebar'
					className='drawer-overlay'
				></label>
				<ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content rounded-tr-3xl'>
					<Link to='/' onClick={toggleDrawer}>
						<div className='flex gap-4 py-5'>
							{user && <Avatar user={user} size='xl' />}

							<div className='flex flex-col justify-center'>
								{user && (
									<>
										<p className='card-title text-lg'>
											{user.firstName} {user.lastName}
										</p>
										<p className='max-w-52 break-words text-xs'>
											{user.email.length > 25 ? (
												<>
													{user.email.substring(0, user.email.indexOf('@'))}
													<br />@{user.email.split('@')[1]}
												</>
											) : (
												user.email
											)}
										</p>
									</>
								)}
							</div>
						</div>
					</Link>
					<div className='border-l h-[1px] bg-base-300 mb-5'></div>
					{!households?.length ? (
						<li>You have no households</li>
					) : (
						households.map((household) => (
							<li key={household.id}>
								<Link to={`/${household.id}/plants`} onClick={toggleDrawer}>
									<FaHouse className='text-xl text-secondary mr-3' />
									{household.name}
								</Link>
							</li>
						))
					)}
					<li className='mt-auto'>
						<a
							href={`${baseURL}/auth/logout?returnUrl=${window.location.origin}`}
						>
							<FaSignOutAlt className='text-xl text-secondary mr-3' />
							Logout
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Drawer;
