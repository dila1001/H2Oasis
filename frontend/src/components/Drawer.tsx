import { FC, ReactNode } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { baseURL } from '../api/api';
import AccountInfo from './AccountInfo';

type DrawerProps = {
	children: ReactNode;
};

const Drawer: FC<DrawerProps> = ({ children }) => {
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
					<AccountInfo />
					<div className='border-l h-[1px] bg-base-300 mb-5'></div>
					<li>
						<a>
							<FaHouse className='text-secondary' />
							Households
						</a>
					</li>
					{/* <li>
						<a>
							<FaUser className='text-secondary' />
							Account Info
						</a>
					</li> */}
					<li>
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
