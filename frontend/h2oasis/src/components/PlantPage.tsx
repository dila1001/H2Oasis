import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plant, getPlantById } from '../api/plantsApi';
import { FaCalendar, FaDroplet, FaPen } from 'react-icons/fa6';
import { FaArrowAltCircleLeft } from 'react-icons/fa';

const PlantPage = () => {
  const { slug } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        const plant = await getPlantById(parseInt(slug, 10));
        console.log(plant);
        setPlant(plant);
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div className='mx-5 my-2 flex-row'>
      <img
        src={plant?.imageUrl}
        alt='Image Description'
        className='object-cover rounded-2xl w-full h-80 shadow-md'
      />
      <div className='p-4 my-4'>
        <div className='flex items-center gap-3'>
          <h2 className='card-title text-3xl mb-1'>{plant?.name}</h2>
          <Link to={`/plants/plant-edit?plant=${plant?.id}`}>
            <FaPen className='text-base-300' />
          </Link>
        </div>

        <p className='text-gray-500'>{plant?.species}</p>
      </div>
      <div className='p-4 my-4 flex flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <FaDroplet className='text-4xl text-success' />
          <div className='flex flex-col'>
            <p className='text-success font-bold'>250ml</p>
            <p className='text-gray-500'>amount of water</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <FaCalendar className='text-4xl text-success' />
          <div className='flex flex-col'>
            <p className='text-success font-bold'>water in 4 days</p>
            <p className='text-gray-500'>
              remind every {plant?.wateringFrequencyInDays} days
            </p>
          </div>
        </div>
      </div>

      <div className='p-4 my-4'>
        <button className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'>
          <FaDroplet className='text-white text-2xl' />
        </button>
      </div>
      {/* <Link to='/plants'>
        <div className='p-4 my-4 flex items-center gap-2 text-base-300 '>
          <FaArrowAltCircleLeft />
          <span>Back</span>
        </div>
      </Link> */}
    </div>
  );
};

export default PlantPage;
