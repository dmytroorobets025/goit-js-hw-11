import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { increasePage, homePage, getGallery } from './js/getGallery';
import { createGalleryItems } from './js/createGalleryItems';
import './css/styles.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  navText: ['&#8592;', '&#8594;'],
});

let searchName = '';

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  homePage();
  loadMoreBtn.classList.add('visually-hidden');

  const { searchQuery } = await e.target.elements;
  searchName = searchQuery.value.trim();

  getGallery(searchName)
    .then(resp => {
      showResultOfSearch(resp.hits);
      Notify.success(`Hooray! We found ${resp.totalHits} images.`);
    })
    .catch(showErrorOfSearch);
}

function showResultOfSearch(resp) {
  if (!resp.length) {
    throw new Error();
  }

  gallery.insertAdjacentHTML('beforeend', createGalleryItems(resp));
  loadMoreBtn.classList.remove('visually-hidden');
  lightbox.refresh();
}

function showErrorOfSearch() {
  return Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onloadMoreBtnClick(e) {
  increasePage();
  getGallery(searchName)
    .then(resp => {
      if (resp.hits.length >= resp.totalHits) {
        throw new Error();
      }
      showResultOfSearch(resp.hits);
    })
    .catch(endOfLoading);
}

function endOfLoading() {
  loadMoreBtn.classList.add('visually-hidden');

  return Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
