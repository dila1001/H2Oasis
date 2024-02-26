import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import './App.css';
import Navbar from './components/Navbar';
import PlantsPage from './pages/Plants';
import PlantPage from './pages/Plant';
import EditPlant from './pages/EditPlant';
import AuthProvider from './auth/AuthProvider';
import { AuthGuard, LoginGuard } from './auth/Guards';
import Login from './pages/Login';
import HouseholdsPage from './pages/Households';
import Drawer from './components/Drawer';
import { HouseholdsProvider } from './context/HouseholdsContext';
import NotFound from './pages/404';

function App() {
	const location = useLocation();

	useEffect(() => {
		const isWarningClosed = sessionStorage.getItem('closeWarning');

		if (!isWarningClosed) {
			const desktopWarningDialog = document.getElementById(
				'desktop-warning'
			) as HTMLDialogElement | null;

			if (desktopWarningDialog && window.innerWidth >= 450) {
				desktopWarningDialog.showModal();
			}
		}
	}, []);

	const exitWarning = () => {
		sessionStorage.setItem('closeWarning', 'true');
	};

	const isLoginPage = location.pathname === '/login';

	return (
		<>
			<dialog id='desktop-warning' className='modal'>
				<div className='modal-box'>
					<h3 className='font-bold text-lg'>Hey there!</h3>
					<p className='py-4'>
						This app is optimized for mobile view only. Please switch to a
						mobile device or resize your browser window.
					</p>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button onClick={() => exitWarning()}>close</button>
				</form>
			</dialog>
			<AuthProvider>
				<HouseholdsProvider>
					<Drawer>
						{!isLoginPage && <Navbar />}
						<Routes>
							<Route element={<LoginGuard />}>
								<Route path='/login' element={<Login />}></Route>
							</Route>
							<Route element={<AuthGuard />}>
								<Route path='/' element={<HouseholdsPage />}></Route>
								<Route
									path='/:householdId/plants'
									element={<PlantsPage />}
								></Route>
								<Route
									path='/:householdId/plants/edit-plant'
									element={<EditPlant />}
								></Route>
								<Route
									path='/:householdId/plants/:plantId'
									element={<PlantPage />}
								></Route>
								<Route path='*' element={<NotFound />} />
							</Route>
						</Routes>
					</Drawer>
				</HouseholdsProvider>
			</AuthProvider>
		</>
	);
}

export default App;
