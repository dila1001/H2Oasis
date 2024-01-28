import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlantsPage from './pages/Plants';
import PlantPage from './pages/Plant';
import EditPlant from './pages/EditPlant';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/plants' element={<PlantsPage />}></Route>
        <Route path='/plants/plant-edit' element={<EditPlant />}></Route>
        <Route path='/plant/:slug' element={<PlantPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
