const API_KEY = "42214171-19f0212e5ab350649bf6ad210";
export const BASE_URL = 'https://pixabay.com/api/';


export const options = {
    params: {
        key: API_KEY,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    }
}
