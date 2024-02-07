import plantImage from '../../assets/5.png';
import { baseURL } from '../../api/api';
import { useSearchParams } from 'react-router-dom';
import Logo from '../../assets/Logo.png';

const Login = () => {
	const [searchParams] = useSearchParams();

	const handleLoginClick = () => {
		const returnUrl = searchParams.get('returnUrl') || '';
		const absoluteReturnUrl = `${window.location.origin}${returnUrl}`;
		window.location.href = `${baseURL}/auth/google?returnUrl=${encodeURIComponent(
			absoluteReturnUrl!
		)}`;
	};

	return (
		<div
			className='h-screen w-screen flex items-center justify-center'
			style={{
				backgroundImage: `url(${plantImage})`,
				backgroundSize: 'contain',
				backgroundPosition: 'bottom right',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<div className='flex flex-col justify-center items-center gap-y-4 pr-10'>
				<div className='pt-24 flex items-center gap-1'>
					<img src={Logo} alt='Logo' className='size-5 ' />
					<h2 className='card-title text-2xl'>Share Leaf</h2>
				</div>
				<button
					className='btn btn-outline btn-secondary w-40'
					onClick={handleLoginClick}
				>
					Login with Google
				</button>
			</div>
		</div>
	);
};

export default Login;
