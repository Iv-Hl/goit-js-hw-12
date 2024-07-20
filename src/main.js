import { fetchImages } from './js/pixabay-api.js';
import {
  renderImages,
  clearGallery,
  showNoResultsMessage,
  showLoadingIndicator,
  hideLoadingIndicator,
  showEndOfResultsMessage,
} from './js/render-functions.js';

const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

loadMoreBtn.classList.add('hidden');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  currentQuery = input.value.trim();
  if (!currentQuery) {
    return;
  }

  currentPage = 1;
  clearGallery();
  loadMoreBtn.classList.add('hidden');
  showLoadingIndicator();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      showNoResultsMessage();
    } else {
      renderImages(data.hits);
      if (totalHits > 15) {
        loadMoreBtn.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoadingIndicator();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoadingIndicator();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    renderImages(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (currentPage * 15 >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      showEndOfResultsMessage();
    }
  } catch (error) {
    console.error('Error:', error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoadingIndicator();
  }
});
