import axios from 'axios';

export async function fetchImg(searchQuery, page) {
  const key = '29925771-85ed6933735d557420d38b301';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return response.data;
}
