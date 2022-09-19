import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '29902848-4caa0334233f13416a85444fb';
const REQUEST_PARAMETERS = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

let currentPage = 1;

export const increasePage = () => {
  currentPage += 1;
};

export const homePage = () => {
  currentPage = 1;
};

export const getGallery = async name => {
  const request = await axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${name}&${REQUEST_PARAMETERS}&page=${currentPage}`
  );

  const resp = request.data;
  return resp;
};
