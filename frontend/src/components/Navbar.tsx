import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const Navbar = () => {
	return (
		<div className='navbar bg-base-100'>
			<div className='navbar-start'>
				<div className='dropdown'>
					<label htmlFor='my-drawer'>
						<div
							tabIndex={0}
							role='button'
							className='btn btn-ghost btn-circle'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M4 6h16M4 12h16M4 18h7'
								/>
							</svg>
						</div>
					</label>
				</div>
			</div>
			<div className='navbar-end'>
					<Link to='/' className='flex items-center'>
						<img src={Logo} alt='Logo' className='size-5' />
						<h1 className='btn btn-ghost pl-1 text-xl'>Share Leaf</h1>
					</Link>
			</div>
		</div>
	);
};

export default Navbar;
