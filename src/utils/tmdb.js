import axios from 'axios';

const API_KEY = '06b3db8d25d0fc3c7fe63120d58c4594';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

export const fetchTrending = (type = 'movie', time = 'week') => api.get(`/trending/${type}/${time}`);
export const fetchPopular = (type) => api.get(`/${type}/popular`);
export const fetchTopRated = (type) => api.get(`/${type}/top_rated`);
export const fetchUpcoming = () => api.get('/movie/upcoming');
export const searchMulti = (query) => api.get('/search/multi', { params: { query } });
export const fetchDetails = (type, id) => api.get(`/${type}/${id}`);
export const fetchVideos = (type, id) => api.get(`/${type}/${id}/videos`);
export const fetchSeasonEpisodes = (tvId, seasonNumber) => api.get(`/tv/${tvId}/season/${seasonNumber}`);

export { IMAGE_BASE_URL };

export default api;
