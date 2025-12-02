import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again!';
const formElement = document.querySelector('#search-form');

formElement.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.currentTarget.searchQuery.value.trim();
  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }
  clearGallery();

  showLoader();

  try {
    const data = await getImagesByQuery(query);
    if (data.hits.length === 0) {
      throw new Error(errorMessage);
    }
    createGallery(data.hits);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: errorMessage,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
