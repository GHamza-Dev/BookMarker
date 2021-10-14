// DOM Elements

const input = document.querySelector('#urlInp');
const submit = document.querySelector('#submit');
const bookmarkes = document.querySelector('.bookmarkes');

// Bookmark Class
class Bookmark {

    constructor(input){
        this.id = this.genetareId();
        this.name = this.extractName(input);
        this.url = this.extractUrl(input);
        this.date = this.genetareDate();
    }

    genetareId(){
        return Bookmark.getFromLocal().length + 1;
    }

    extractName(input){
        return input.slice(input.indexOf('#') + 1);
    }

    extractUrl(input){
        return input.slice(0, input.indexOf('#')).trim();
    }

    genetareDate(){
        const date = new Date();
        return `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;
    }

    // Create and append bookmark to the UI
    displayBookmark() {
        const div = document.createElement('div');
        div.className = 'bookmark';
        let bookmark = `
                <div class="row">
                    <div class="name">${this.name}</div>
                    <div class="btns">
                        <div class="visit"><a href="${this.url}" target="_blanc" title="To ${this.name}">visit</a></div>
                         <button class="delete" data-id="${this.id}">Delete</button>
                    </div>
                </div>
                <small>Created at : ${this.date}</small>
        `;
        div.innerHTML = bookmark;
        bookmarkes.appendChild(div);

    }

    // Remove bookmark
    static remove(el) {
        if (el.className === 'delete') {

            let bkms = this.getFromLocal();
            let dataId = el.getAttribute('data-id');
            // Remove from UI
            el.parentElement.parentElement.parentElement.remove();

            // Remove From Local Storage
            let index = bkms.findIndex((bkm) => bkm.id == dataId);
            Bookmark.removeFromLocal(index);
        }
    }

    // Get from local storage
    static getFromLocal() {
        let bookm;
        if (!localStorage.getItem('bookm')) {
            bookm = [];
        } else {
            bookm = JSON.parse(localStorage.getItem('bookm'));
        }
        return bookm;
    }

    // Save to localStorage
    static saveToLocal(book) {
        let bookm = this.getFromLocal(); //let bookm = getLocal();
        bookm.push(book);
        localStorage.setItem('bookm', JSON.stringify(bookm));
    }

    // Remove from local storage
    static removeFromLocal(index){
        let bookmarkes = this.getFromLocal();
        bookmarkes.splice(index,1);
        localStorage.setItem('bookm', JSON.stringify(bookmarkes));
    }

}


// Init function
const init = (e) => {
    e.preventDefault();
    if (input.value == '') {
        alert('Ops ! it seems like you forgot somthing ;) \n Please put a valid url :)');
    } else {

        const newbookmark = new Bookmark(input.value);
        newbookmark.displayBookmark();
        Bookmark.saveToLocal(newbookmark);

        // Clear input field
        input.value = '';
    }
}


// Events 
submit.addEventListener('click', init);

// Display saved bookmarkes
document.addEventListener('DOMContentLoaded', () => {
    const bkms = Bookmark.getFromLocal();
    let bookmark = ' ';
    bkms.forEach(item => {
        bookmark += `
            <div class="bookmark">
                <div class="row">
                    <div class="name">${item.name}</div>
                    <div class="btns">
                        <div class="visit"><a href="${item.url}" target="_blanc" title="To ${item.name}">visit</a></div>
                         <button class="delete" data-id="${item.id}">Delete</button>
                    </div>
                </div>
                <small>Created at : ${item.date}</small>
            </div>    
        `;
    });
    bookmarkes.innerHTML = bookmark;
});


// Remove bookmark
window.addEventListener('click', (e) => {
    let el = e.target;
    Bookmark.remove(el);
});