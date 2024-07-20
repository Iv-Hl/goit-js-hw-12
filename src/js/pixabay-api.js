import axios from 'axios';

const API_KEY = '45031558-a09c4143603aaf44ec68d2085';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15&page=${page}`;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Failed to fetch images');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
