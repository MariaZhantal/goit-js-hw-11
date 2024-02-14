import { PixaBayApi } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { LoadMoreBtn } from './components/LoadMoreButton';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('form');
const loaderEl = document.querySelector('.loader');

const api = new PixaBayApi();
const loadMoreButton = new LoadMoreBtn({
    selector: '.load-more',
    isHidden: true,
});

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

loadMoreButton.button.addEventListener('click', () => {
    // Show loader before making API call
    loaderEl.classList.remove('is-hidden');

    api.get(globalSearchQuery)
        .then(data => {
            loaderEl.classList.add('is-hidden');
            loadMoreButton.show();

            if (data.hits.length <= 0) {
                return Notify.failure(`We're sorry, but you've reached the end of search results`);
            }

            displayImages(data.hits);
        })
        .catch(error => {
            loaderEl.classList.add('is-hidden');
            Notify.failure(`Request page is out of range!`);
        });
});

function displayImages(hits) {
    galleryEl.innerHTML = '';

    hits.forEach(hit => {
        const {
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        } = hit;

        const photoCardHTML = `
            <li class="gallery__item">
                <a class="gallery__link" href="${webformatURL}">
                    <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
                </a>
                <div class="info">
                    <p class="info-item"><b>Likes:</b> ${likes}</p>
                    <p class="info-item"><b>Views:</b> ${views}</p>
                    <p class="info-item"><b>Comments:</b> ${comments}</p>
                    <p class="info-item"><b>Downloads:</b> ${downloads}</p>
                </div>
            </li>
        `;
        galleryEl.insertAdjacentHTML('beforeend', photoCardHTML);
    });

    galleryEl.classList.remove('is-hidden');
    lightbox.refresh();


     const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();


     const totalAddedHeight = hits.length * cardHeight;
 

     window.scrollBy({
         top: totalAddedHeight,
         behavior: "smooth",
     });
}

let globalSearchQuery = '';

function handleSubmit(event) {
    event.preventDefault();

    const searchQuery = event.target.elements.searchQuery.value.trim();
    globalSearchQuery = searchQuery;

    if (searchQuery) {
        loaderEl.classList.remove('is-hidden');

        api.get(searchQuery)
        .then(data => {
                loaderEl.classList.add('is-hidden');
                loadMoreButton.show();

                const totalHits = data.totalHits;

                if (data.hits.length > 0) {
                    Notify.success(`Hooray! We found ${totalHits} totalHits images.`);
                    
                }
                else if(data.hits.length <= 0) {
                    loadMoreButton.hide();
                    return Notify.failure(`Sorry, there are no images matching your search query. Please try again`);
                }

                displayImages(data.hits);
            })
            .catch(error => {
                loaderEl.classList.add('is-hidden');
                Notify.failure(`Request page is out of range!`);
            });
    }
}

formEl.addEventListener('submit', handleSubmit);


