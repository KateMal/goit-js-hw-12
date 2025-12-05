import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const errorMessage =
  'Sorry, there are no images matching your search query. Please try again!';
const endOfCollectionMessage =
  "We're sorry, but you've reached the end of search results.";

const formElement = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('.load-more-button');
loadMoreButton.disabled = true;

// Global state
let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// Form submit - new search
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

  // Reset pagination for new search
  currentQuery = query;
  loadMoreButton.disabled = false;
  currentPage = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, currentPage);

    if (data.hits.length === 0) {
      throw new Error(errorMessage);
    }

    totalHits = data.totalHits;
    createGallery(data.hits);

    // Show Load more button if there are more images
    if (currentPage * 15 < totalHits) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message || errorMessage,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

// Load more button click
loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      throw new Error(errorMessage);
    }

    createGallery(data.hits);

    // Check if we've reached the end
    if (currentPage * 15 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: endOfCollectionMessage,
        position: 'topRight',
      });
    }

    // Smooth scroll to the first newly added image
    smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message || errorMessage,
      position: 'topRight',
    });
    currentPage -= 1; // Revert page on error
  } finally {
    hideLoader();
  }
});

// Smooth scroll function
function smoothScroll() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const firstItem = galleryItems[0];
    const rect = firstItem.getBoundingClientRect();
    const cardHeight = rect.height;

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
