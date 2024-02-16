import axios from "axios";
import { Notify } from "notiflix";

const API_KEY = "42214171-19f0212e5ab350649bf6ad210";
const BASE_URL = 'https://pixabay.com/api/';


export class PixaBayApi{
    constructor(){
        this.queryPage = 1;
        this.searchQuery = '';
    }

    get(searchQuery){
        
        const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.queryPage}`;
       
        const options = {
           
            headers: {
                'X-Api-Key' : API_KEY,
            },
        };

        return axios.get(url, options.headers)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    this.incrementPage();
                    return response.data; 
                } else {
                    Notify.failure(`Request page is out of range!`);
                }
                
                
                
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error; 
            });
    }

    resetPage(){
        this.queryPage = 1;
    }

    incrementPage(){
        this.queryPage += 1;
    }
   


}