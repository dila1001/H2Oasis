import { FC } from 'react';

type PlantCardProps = {
  name: string;
  species: string;
  imageUrl: string;
};

const PlantCard: FC<PlantCardProps> = ({ name, species, imageUrl }) => {
  return (
    <div className='card bg-base-100 shadow-md my-6 flex-row'>
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
          {/* <button className='btn btn-secondary'>Buy Now</button> */}
          <div
            className='radial-progress text-success'
            style={{ '--value': 70 }}
            role='progressbar'
          >
            2
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
