import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { LoadMoreBtn } from './components/LoadMoreButton';
import SimpleLightbox from "simplelightbox";
import { BASE_URL, options } from './pixabay-api';

import "simplelightbox/dist/simple-lightbox.min.css";

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('form');
const loaderEl = document.querySelector('.loader');
const searchQuery = document.querySelector('input[name="searchQuery"]')

const loadMoreButton = new LoadMoreBtn({
    selector: '.load-more',
    isHidden: true,
});




const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });


loadMoreButton.button.addEventListener('click', async () => {
    loaderEl.classList.remove('is-hidden');
    loadMoreButton.hide();
    options.params.page++; 
 
    try {

        const response = await axios.get(BASE_URL, options);
        const hits = response.data.hits;
        const perPage = options.params.per_page;
        const maxPages = Math.ceil(totalHits / perPage);
       
        loaderEl.classList.add('is-hidden');
        loadMoreButton.show();
        if (hits.length === 0) {
            Notify.info("We're sorry, but you've reached the end of the search results.");
            loadMoreButton.hide();
            
        }else if(options.params.page > maxPages) {
            Notify.info("You've reached the end of the search results.");
            loadMoreButton.hide();
        }else{
            displayImages(hits);
        }
        
       
    } catch (error) {
        if (error.response.data === "[ERROR 400] \"page\" is out of valid range.") {
            Notify.info("You've reached the end of the search results.");
            loadMoreButton.hide();
        } else {
            Notify.failure(error.message);
        }
        loaderEl.classList.add('is-hidden')
    }
});


let totalHits = 0;
let reachedEnd = false;

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

     
    window.scrollBy({
        top: cardHeight,
        behavior: 'smooth',
    })

     
}






let globalSearchQuery = '';

async function handleSubmit(event) {
    event.preventDefault();

    const searchQueryValue = event.target.elements.searchQuery.value.trim();
    if (searchQueryValue === '') {
        return;
    }

    options.params.q = searchQueryValue;
    options.params.page = 1;
    galleryEl.innerHTML = '';
    reachedEnd = false;

    try {
        const response = await axios.get(BASE_URL, options);
        totalHits = response.data.totalHits;
       

        const { hits } = response.data;
        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again");
            loadMoreButton.hide();
        }else{
            Notify.success(`Hooray! We found ${totalHits} images`);
            loadMoreButton.show();
            displayImages(hits);
        }

        
    } catch (error) {
        Notify.failure(error.message); 
    }
}


formEl.addEventListener('submit', handleSubmit);

