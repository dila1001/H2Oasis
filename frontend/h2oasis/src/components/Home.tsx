import { useNavigate } from 'react-router-dom';
import plantImage from '../assets/5.png';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='max-h-screen max-w-screen flex justify-between overflow-x-hidden items-end'>
      <div className='flex flex-col justify-center items-center gap-4 translate-x-[70px] z-40'>
        <h2 className='max-w-max card-title text-2xl'>H2Oasis</h2>
        <button
          className='btn btn-outline btn-secondary mb-60 w-40'
          onClick={() => navigate('/plants')}
        >
          View My Plants
        </button>
      </div>

      <img src={plantImage} alt='' className='h-screen ml-[-40px]' />
    </div>
  );
};

export default Home;
