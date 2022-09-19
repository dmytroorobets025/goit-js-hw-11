import '../css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImageApi from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const imageApi = new ImageApi();

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

loadMoreButton.classList.add('is-hidden');

//************Function onSearch****************/////

async function onSearch(event) {
  event.preventDefault();
  clearGallery();

  imageApi.query = event.currentTarget.elements.searchQuery.value;
  imageApi.resetPage();
  imageApi.resethitsCounter();

  if (imageApi.searchQuery === '') {
    return;
  }

  const imgResponse = await imageApi.fetchImages();
  try {
    if (imgResponse.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.classList.add('is-hidden');
    }
    if (imgResponse.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${imgResponse.totalHits} images!`
      );

      loadMoreButton.classList.remove('is-hidden');
      createImageCard(imgResponse.hits);
    }
    if (
      (imageApi.viewedHits === imageApi.totalHits) &
      (imgResponse.totalHits !== 0)
    ) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreButton.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

//************Function onLoadMore****************/////

async function onLoadMore() {
  const imgResponse = await imageApi.fetchImages();
  if (imageApi.viewedHits === imageApi.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreButton.classList.add('is-hidden');
  }
  createImageCard(imgResponse.hits);

  autoScroll();
}

//************Function createImageCard****************/////

function createImageCard(imageCard) {
  const markupList = imageCard
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: <span>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views: <span>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments: <span>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads: <span>${downloads}</span></b>
    </p>
  </div>
  </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markupList);
  const lightbox = new SimpleLightbox('.gallery a');
}

//************Function clearGallery****************/////

function clearGallery() {
  gallery.innerHTML = '';
}

//************Function autoScroll****************/////

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
