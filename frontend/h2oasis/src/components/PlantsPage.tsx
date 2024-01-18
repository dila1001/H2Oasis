import { useEffect, useState } from 'react';
import { Plant, getPlants } from '../api/plantsApi';
import SearchBar from './SearchBar';
import PlantCard from './ui/PlantCard';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa6';

const PlantsPage = () => {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const plants = await getPlants();
      setPlants(plants);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className='mx-5'>
        <SearchBar />

        {plants.map((plant) => (
          <Link to={`/plant/${plant.id}`} key={plant.id}>
            <PlantCard
              name={plant.name}
              species={plant.species}
              imageUrl={plant.imageUrl}
            />
          </Link>
        ))}

        <div className='my-8'>
          <Link to='/plants/plant-edit'>
            <button className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'>
              <FaPlus className='text-white text-2xl' />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlantsPage;
