import axios from 'axios';

const BASE_URL = 'https://api.spacexdata.com/v3/launches';

export const fetchLaunches = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${(page - 1) * limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
};
