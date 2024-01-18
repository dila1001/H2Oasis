import React from 'react';
import { useParams } from 'react-router-dom';

const PlantPage = () => {
  const { slug } = useParams();

  return <h1>Plant Page - {slug}</h1>;
};

export default PlantPage;
