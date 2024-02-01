import axios from 'axios';

export const baseURL =
	process.env.NODE_ENV === 'production'
		? 'https://plantapp-salt.azurewebsites.net/api'
		: 'https://localhost:5005/api';

const api = axios.create({
	baseURL,
	withCredentials: true,
});

export default api;
