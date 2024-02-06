import { useEffect, useState } from 'react';
import {
	NewPlant,
	Plant,
	getPlants,
	updatePlant,
} from '../../services/plantsService';
import SearchBar from './SearchBar';
import PlantCard from './PlantCard';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { FaPlantWilt, FaPlus } from 'react-icons/fa6';
import { getDaysLeft, getTodaysDate } from '../../utils/dateUtils';
import QRCode from 'react-qr-code';
import { useHouseholds } from '../../hooks/useHouseholds';
import AvatarGroup from '../../components/UI/AvatarGroup';
import { useAuth } from '../../auth/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeartBroken } from 'react-icons/fa';
import {
	DeleteUserFromHousehold,
	getHouseholdsForUser,
} from '../../services/householdsService';
import UserInfo from '../../components/UI/UserInfo';

const PlantsPage = () => {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPlant, setSelectedPlant] = useState<Plant | undefined>(
		undefined
	);
	const [error, setError] = useState(false);
	const { households, setHouseholds } = useHouseholds();
	const { user } = useAuth();
	const { householdId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const household = households?.find((h) => h.id === householdId);

	useEffect(() => {
		const deletedPlant = searchParams.get('deletedPlant');
		if (deletedPlant) {
			toast.success(`${deletedPlant} has been successfully deleted`, {
				id: 'delete-plant',
			});
		}

		const fetchData = async () => {
			try {
				if (householdId) {
					if (isLoading) {
						setIsLoading(true);
					}
					const fetchedPlants = await getPlants(householdId);
					setPlants(fetchedPlants || []);
					setError(false);
				}
			} catch (error) {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [householdId, households]);

	const sortedPlants = [...plants].sort((a, b) => {
		const daysLeftA = getDaysLeft(a.lastWatered, a.wateringFrequencyInDays);
		const daysLeftB = getDaysLeft(b.lastWatered, b.wateringFrequencyInDays);

		return daysLeftA - daysLeftB;
	});

	const overduePlants = sortedPlants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft < 0;
	});

	const todayPlants = sortedPlants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft === 0;
	});

	const upcomingPlants = sortedPlants.filter((plant) => {
		const daysLeft = getDaysLeft(
			plant.lastWatered,
			plant.wateringFrequencyInDays
		);
		return daysLeft > 0;
	});

	const viewLoadingSkeleton = () => {
		return (
			<div>
				<div className='skeleton w-full h-20 my-6 bg-base-200'></div>
				<div className='skeleton w-full h-12 my-6 bg-base-200'></div>
				{[1, 2, 3, 4].map((item) => (
					<div
						key={item}
						className='skeleton w-full h-32 my-6 bg-base-200'
					></div>
				))}
			</div>
		);
	};

	const QRCodeValue = `${window.location.origin}?inviteCode=${householdId}`;

	const openWaterModal = (plantId: string) => {
		const plants = households?.find((h) => h.id === householdId)?.plants;
		const plant = plants?.find((p) => p.id === plantId);
		setSelectedPlant(plant);

		(
			document.getElementById('water-modal') as HTMLDialogElement | null
		)?.showModal();
	};

	const waterPlant = async () => {
		if (user && selectedPlant && householdId) {
			const updatedPlantData: NewPlant = {
				name: selectedPlant.name,
				species: selectedPlant.species,
				imageUrl: selectedPlant.imageUrl,
				wateringFrequencyInDays: selectedPlant.wateringFrequencyInDays,
				lastWatered: getTodaysDate(),
				waterAmountInMl: selectedPlant.waterAmountInMl,
				location: selectedPlant.location,
				lastWateredBy: user.firstName,
			};
			const updatedPlant = await updatePlant(
				selectedPlant.id,
				householdId,
				updatedPlantData
			);

			if (updatedPlant) {
				setHouseholds((prevHouseholds) => {
					if (!prevHouseholds) return prevHouseholds;

					return prevHouseholds.map((household) => {
						if (
							household.plants.find((plant) => plant.id === updatedPlant.id)
						) {
							const updatedPlants = household.plants.map((plant) =>
								plant.id === updatedPlant.id ? updatedPlant : plant
							);
							return { ...household, plants: updatedPlants };
						}

						return household;
					});
				});
			}

			toast.success(`${selectedPlant?.name} has been successfully watered`);
		}
	};

	const leaveHousehold = async () => {
		if (householdId && user) {
			await DeleteUserFromHousehold(householdId, user.id);
			const response = await getHouseholdsForUser(user.id);
			setHouseholds(response);
			navigate(`/?leftHousehold=${household?.name}`);
		}
	};

	return (
		<>
			<div className='mx-5'>
				<Toaster position='top-center' reverseOrder={false} />

				{/* QR code modal */}
				<dialog id='show-qrcode' className='modal'>
					<div className='modal-box h-[500px] flex flex-col items-center justify-center'>
						<form method='dialog'>
							<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
								✕
							</button>
						</form>

						<h3 className='font-bold text-lg text-center mt-4 mb-1 text-neutral'>
							Invite to {household?.name}
						</h3>
						<p className='text-center text-sm mb-4'>
							Share this QR code with your friend/family <br />
							to invite them to this household
						</p>
						<div className='py-4 flex justify-center'>
							<QRCode value={QRCodeValue} bgColor='#F8FDEF' fgColor='#343300' />
						</div>
					</div>
				</dialog>

				{/* View users modal */}
				<dialog id='view-users' className='modal'>
					<div className='modal-box flex flex-col items-center justify-center'>
						<form method='dialog'>
							<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
								✕
							</button>
						</form>
						<div className='max-h-[400px] overflow-y-scroll px-4'>
							{household?.users.map((user) => (
								<UserInfo user={user} />
							))}
						</div>
					</div>
				</dialog>

				{/* Modal for leave household */}
				<dialog id='leave-household' className='modal'>
					<div className='modal-box'>
						<h3 className='font-bold text-lg'>
							Are you sure you want to leave {household?.name}?
						</h3>
						<p className='py-4'>Click yes to leave and no to abort.</p>
						<div className='modal-action'>
							<form method='dialog' className='w-full flex gap-2 justify-end'>
								<button
									className='btn bg-accent text-white'
									onClick={() => leaveHousehold()}
								>
									Yes
								</button>
								<button
									onClick={() =>
										(
											document.getElementById(
												'leave-household'
											) as HTMLDialogElement | null
										)?.close()
									}
									className='btn'
								>
									No
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Water plant modal */}
				<dialog id='water-modal' className='modal'>
					<div className='modal-box'>
						<h3 className='font-bold text-lg'>
							Water {selectedPlant?.name} now?
						</h3>
						<p className='py-4'>Press yes to water or no to close</p>
						<div className='modal-action'>
							<form method='dialog' className='w-full flex gap-2 justify-end'>
								<button
									className='btn bg-accent text-white'
									onClick={() => waterPlant()}
								>
									Yes
								</button>
								<button className='btn'>No</button>
							</form>
						</div>
					</div>
				</dialog>

				{!error && !isLoading && (
					<>
						<div className='flex items-center'>
							<h2 className='card-title my-6 text-center w-full'>
								{household?.name}
							</h2>
							{household?.users && (
								<div className='dropdown dropdown-end dropdown-hover'>
									<div tabIndex={0} role='button'>
										<AvatarGroup users={household?.users} />
									</div>
									<ul
										tabIndex={0}
										className='dropdown-content z-[1] menu p-2 shadow bg-[#f9fcf4] rounded-box w-40'
									>
										<li
											onClick={() =>
												(
													document.getElementById(
														'view-users'
													) as HTMLDialogElement | null
												)?.showModal()
											}
										>
											<a>View users</a>
										</li>
										<li
											onClick={() =>
												(
													document.getElementById(
														'show-qrcode'
													) as HTMLDialogElement | null
												)?.showModal()
											}
										>
											<a>Invite user</a>
										</li>
										<li
											onClick={() =>
												(
													document.getElementById(
														'leave-household'
													) as HTMLDialogElement | null
												)?.showModal()
											}
										>
											<a>Leave household</a>
										</li>
									</ul>
								</div>
							)}
						</div>
						<div className='mb-6'>
							<SearchBar />
						</div>
					</>
				)}

				{/* Check for loading state */}
				{isLoading && viewLoadingSkeleton()}

				{/* Check for error state */}
				{error && (
					<div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6'>
						<FaHeartBroken className='text-warning text-[120px]' />
						<h1 className='card-title text-neutral mb-12 text-center'>
							An error occured while fetching plants
						</h1>
						<Link to={`/`}>
							<button className='btn btn-neutral'>Go home</button>
						</Link>
					</div>
				)}

				{/* Check for empty state */}
				{plants.length === 0 && !isLoading && !error && (
					<div className='flex flex-col items-center justify-center h-[calc(100vh-220px)] gap-6'>
						<FaPlantWilt className='text-warning text-[120px]' />
						<h2 className='card-title text-neutral mb-12 text-center'>
							This household has no plants.
						</h2>
						<Link to={`/${householdId}/plants/edit-plant`}>
							<button className='btn btn-neutral'>Add a plant</button>
						</Link>
					</div>
				)}

				{/* Render plants */}
				{plants.length > 0 && (
					<div>
						{/* Overdue Plants */}
						{overduePlants.length > 0 && (
							<div className='mb-8'>
								<h4 className='font-bold text-sm text-neutral mb-3'>Overdue</h4>
								{overduePlants.map((plant) => (
									<Link
										to={`/${householdId}/plants/${plant.id}`}
										key={plant.id}
									>
										<PlantCard
											name={plant.name}
											species={plant.species}
											imageUrl={plant.imageUrl}
											lastWatered={plant.lastWatered}
											waterFrequency={plant.wateringFrequencyInDays}
											onClick={() => openWaterModal(plant.id)}
										/>
									</Link>
								))}
							</div>
						)}

						{/* Today Plants */}
						{todayPlants.length > 0 && (
							<div className='mb-8'>
								<h4 className='font-bold text-sm text-neutral mb-3'>Today</h4>
								{todayPlants.map((plant) => (
									<Link
										to={`/${householdId}/plants/${plant.id}`}
										key={plant.id}
									>
										<PlantCard
											name={plant.name}
											species={plant.species}
											imageUrl={plant.imageUrl}
											lastWatered={plant.lastWatered}
											waterFrequency={plant.wateringFrequencyInDays}
											onClick={() => openWaterModal(plant.id)}
										/>
									</Link>
								))}
							</div>
						)}

						{/* Upcoming Plants */}
						{upcomingPlants.length > 0 && (
							<div className='mb-8'>
								<h4 className='font-bold text-sm text-neutral mb-3'>
									Upcoming
								</h4>
								{upcomingPlants.map((plant) => (
									<Link
										to={`/${householdId}/plants/${plant.id}`}
										key={plant.id}
									>
										<PlantCard
											name={plant.name}
											species={plant.species}
											imageUrl={plant.imageUrl}
											lastWatered={plant.lastWatered}
											waterFrequency={plant.wateringFrequencyInDays}
										/>
									</Link>
								))}
							</div>
						)}
						<div className='my-12'>
							<Link to={`/${householdId}/plants/edit-plant`}>
								<button className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'>
									<FaPlus className='text-white text-2xl' />
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default PlantsPage;
