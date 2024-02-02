import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export const AuthGuard = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? (
		<Outlet />
	) : (
		<Navigate to={`/login?returnUrl=${window.location.pathname}`} />
	);
};

export const LoginGuard = () => {
	const { isLoggedIn } = useAuth();

	return !isLoggedIn ? <Outlet /> : <Navigate to='/' replace />;
};
