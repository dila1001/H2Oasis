import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  NewPlant,
  Plant,
  addPlant,
  getPlantById,
  updatePlant,
} from '../../services/plantsService';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, SubmitHandler, UseFormStateReturn, useForm } from 'react-hook-form';
import { FaSeedling } from 'react-icons/fa6';
import { Toaster } from 'react-hot-toast';
import DatePicker from '../../components/UI/DatePicker';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

const EditPlant = () => {
  const [searchParams] = useSearchParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewPlant>();

  useEffect(() => {
    const fetchPlant = async () => {
      const queryValue = searchParams.get('plant');
      if (queryValue) {
        const plant = await getPlantById(queryValue);
        setPlant(plant);
        reset({
          name: plant!.name,
          species: plant!.species,
          imageUrl: plant!.imageUrl,
          wateringFrequencyInDays: plant!.wateringFrequencyInDays.toString(),
          lastWatered: plant!.lastWatered,
          waterAmountInMl: plant!.waterAmountInMl,
        });
      }
    };
    fetchPlant();
  }, [searchParams, reset]);

  const onSubmit: SubmitHandler<NewPlant> = async (data) => {
    let response;
    if (plant) {
      response = await updatePlant(plant.id, data);
      navigate(`/plant/${response?.id}?saved=true`);
    } else {
      response = await addPlant(data);
      navigate(`/plant/${response?.id}?created=true`);
    }
  };

  return (
    <div className='mx-5 my-2 flex flex-col gap-4'>
      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 4000,
          },
        }}
      />
      <h2 className='card-title text-3xl mb-4'>
        {plant ? plant.name : 'Add New Plant'}
      </h2>
      <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
        <input
          type='text'
          placeholder='Name'
          className='input input-bordered input-success w-full'
          {...register('name', {
            required: 'Name is required',
          })}
        />
        <input
          type='text'
          placeholder='Species'
          className='input input-bordered input-success w-full'
          {...register('species', {
            required: 'Species is required',
          })}
        />
        <input
          type='text'
          placeholder='Image URL'
          className='input input-bordered input-success w-full'
          {...register('imageUrl')}
        />
        <input
          type='number'
          placeholder='Watering frequency in days'
          className='input input-bordered input-success w-full'
          {...register('wateringFrequencyInDays', {
            required: 'Watering frequency is required',
          })}
        />
        <input
          type='number'
          placeholder='Amount of water in ml'
          className='input input-bordered input-success w-full'
          {...register('waterAmountInMl', {
            required: 'Water amount is required',
          })}
        />
        <input
          type='text'
          placeholder='Last watered'
          className='input input-bordered input-success w-full'
          {...register('lastWatered', {
            required: 'Last watered date is required',
          })}
        />
        <Controller render={({ field }) => <DatePicker date={ } />}
          name={'lastWateredDatePicker'} />

        <input
          type="date"
          name="lastWateredDatePicker"
          className='input input-bordered input-success w-full'
          value={date ? date.toISOString() : 'Insert date'}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
        />

        <div className='p-4 my-4'>
          <button
            className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'
            type='submit'
            disabled={isSubmitting}
          >
            <FaSeedling className='text-white text-2xl' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlant;
