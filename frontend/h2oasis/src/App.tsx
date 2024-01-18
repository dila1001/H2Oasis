import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PlantsPage from './components/PlantsPage';
import PlantPage from './components/PlantPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/plants' element={<PlantsPage />}></Route>
        <Route path='/plant/:slug' element={<PlantPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
