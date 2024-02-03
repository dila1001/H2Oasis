import { FaPlantWilt } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6'>
			<FaPlantWilt className='text-warning text-[120px]' />
			<h1 className='card-title text-neutral mb-12'>
				Oops! You seem to be lost.
			</h1>
			<button className='btn btn-neutral' onClick={() => navigate(-1)}>
				Go back
			</button>
		</div>
	);
};

export default NotFound;
