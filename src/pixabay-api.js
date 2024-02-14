import axios from "axios";
import { Notify } from "notiflix";


// axios.defaults.headers.common["x-api-key"] = "42214171-19f0212e5ab350649bf6ad210";
const API_KEY = "42214171-19f0212e5ab350649bf6ad210";
const BASE_URL = 'https://pixabay.com/api/';


export class PixaBayApi{
    constructor(){
        this.queryPage = 1;
        this.searchQuery = '';
    }

    get(searchQuery){
        // const url = `${BASE_URL}?q${this.searchQuery}$per_page=20page=$${this.queryPage}`;
        // const url = `${BASE_URL}?q=${this.searchQuery}&per_page=20&page=${this.queryPage}`;
        
        const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`;
        // const url = `${BASE_URL}?key=${API_KEY}&q=yellow+flowers&image_type=photo&pretty=true`;
        // const url = `${BASE_URL}?key=${API_KEY}&q=yellow+flowers`;
        const options = {
            // mode: 'no-cors',
            headers: {
                'X-Api-Key' : API_KEY,
            },
        };

        return axios.get(url, options.headers)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    this.incrementPage();
                    return response.data; // Return the parsed JSON data
                } else {
                    Notify.failure(`Request page is out of range!`);
                }
                
                
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error; // Re-throw the error to handle it elsewhere if needed
            });
    }

    resetPage(){
        this.queryPage = 1;
    }

    incrementPage(){
        this.queryPage += 1;
    }
   


}