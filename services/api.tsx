import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wilayah.id/api',
});

export default api;