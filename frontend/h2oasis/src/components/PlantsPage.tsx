import { useEffect, useState } from 'react';
import { Plant, getPlants } from '../api/plantsApi';
import SearchBar from './SearchBar';
import PlantCard from './ui/PlantCard';
import { Link } from 'react-router-dom';

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
      </div>
    </>
  );
};

export default PlantsPage;
