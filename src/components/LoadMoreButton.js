import { PixaBayApi } from "../pixabay-api";

export class LoadMoreBtn {
    constructor({ selector, isHidden = false, events }) {
        this.button = this.getButton(selector);
        isHidden && this.hide();
    }

    getButton(selector) {
        return document.querySelector(selector);
    }

    enable() {
        this.button.disabled = false;
        this.button.textContent = 'Load More';
    }

    disable() {
        this.button.disabled = true;
        this.button.textContent = 'Loading...';
    }

    hide() {
        this.button.classList.add('is-hidden');
    }

    show() {
        this.button.classList.remove('is-hidden');
    }

    // loadData() {
    //     const globalSearchQuery = ''; // Assign the value of globalSearchQuery here
    //     this.api.get(globalSearchQuery);
    // }
}
