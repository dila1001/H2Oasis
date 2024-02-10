import { FC, ReactNode, useEffect, useState } from 'react';

import { Link, useMatch } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';

import { baseURL } from '../api/api';
import { useAuth } from '../auth/useAuth';
import { useHouseholds } from '../hooks/useHouseholds';
import UserInfo from './UI/UserInfo';

type DrawerProps = {
	children: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
	const { user } = useAuth();
	const { households } = useHouseholds();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const match = useMatch('/:householdId/*');
	const [id, setId] = useState('');

	useEffect(() => {
		if (match) {
			const { householdId } = match.params;
			if (householdId) {
				setId(householdId);
			}
		} else {
			setId('');
		}
	}, [match]);

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
						{user && <UserInfo user={user} />}
					</Link>
					<div className='border-l h-[1px] bg-base-300 mb-5'></div>
					{!households?.length ? (
						<li>You have no households</li>
					) : (
						households.map((household) => (
							<li
								key={household.id}
								className={`${
									id === household.id
										? 'bg-neutral rounded-md text-neutral-content'
										: ''
								}`}
							>
								<Link to={`/${household.id}/plants`} onClick={toggleDrawer}>
									<FaHouse className='text-xl mr-3 text-secondary' />
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
