import { FC } from 'react';
import { getDaysLeft, getPercentage } from '../../utils/dateUtils';

type PlantCardProps = {
  name: string;
  species: string;
  imageUrl: string;
  lastWatered: string;
  waterFrequency: string;
};

const PlantCard: FC<PlantCardProps> = ({
  name,
  species,
  imageUrl,
  lastWatered,
  waterFrequency,
}) => {
  return (
    <div className='card bg-[#f9fcf4] shadow-md my-6 flex-row'>
      <div className='max-h-48 w-1/4 overflow-hidden rounded-tl-2xl rounded-bl-2xl'>
        <img className='w-full h-full object-cover' src={imageUrl} alt={name} />
      </div>
      <div className='card-body p-4 flex-1 flex-row'>
        <div>
          {' '}
          <h2 className='card-title'>{name}</h2>
          <p className='text-gray-500'>{species}</p>
        </div>

        <div className='card-actions flex justify-end mt-2 ml-auto'>
          <div
            className='radial-progress text-success'
            style={{
              '--value': getPercentage(
                getDaysLeft(lastWatered, waterFrequency),
                waterFrequency
              ),
            }}
            role='progressbar'
          >
            {getDaysLeft(lastWatered, waterFrequency)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
