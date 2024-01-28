import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.example.com'
    : 'https://localhost:5005/api';

const api = axios.create({
  baseURL,
});

export default api;
