import axios from 'axios';
const API_KEY = '53405019-6c96446ba48ce1565d886076e';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  // Build request using axios params so queries are encoded properly
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo', // only photos
    orientation: 'horizontal', // horizontal orientation
    safesearch: true, // filter for safe content
    page: page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}
