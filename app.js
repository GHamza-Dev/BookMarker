// DOM Elements

const input = document.querySelector('#urlInp');
const submit = document.querySelector('#submit');
const bookmarkes = document.querySelector('.bookmarkes');

// Bookmark Class
class Bookmark {

    name;
    url;
    date;

    // Filter input and assign it to the class properties
    filterInput(input) {

        let index = input.indexOf('#');
        this.name = input.slice(index + 1);
        this.url = input.slice(0, index).trim();
        // Create Date
        const date = new Date();
        this.date = `${date.getUTCDay()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;

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
                         <button class="delete">Delete</button>
                    </div>
                </div>
                <small>Created at : ${this.date}</small>
        `;
        div.innerHTML = bookmark;
        bookmarkes.appendChild(div);

    }

    // Remove bookmark
    remove(el) {
        let bkms = new Bookmark().getFromLocal();
        let len = bkms.length;
        let name = '';

        if (el.className === 'delete') {
            name = el.parentElement.previousElementSibling.textContent;
            // Remove from UI
            el.parentElement.parentElement.parentElement.remove();
            // Remove From Local Storage
            if (len === 1) {
                bkms.splice(0, 1);
            } else {
                for (let i = 0; i < len - 1; i++) {
                    if (bkms[i].name === name) {
                        bkms.splice(i, 1);
                    }
                }
            }
            localStorage.setItem('bookm', JSON.stringify(bkms));
        }
    }

    // Get from local storage
    getFromLocal() {
        let bookm;
        if (!localStorage.getItem('bookm')) {
            bookm = [];
        } else {
            bookm = JSON.parse(localStorage.getItem('bookm'));
        }
        return bookm;
    }

    // Save to localStorage
    saveToLocal(book) {
        let bookm = this.getFromLocal(); //let bookm = getLocal();
        bookm.push(book);
        localStorage.setItem('bookm', JSON.stringify(bookm));
    }

} // END Class 


// Init function
const init = (e) => {
    e.preventDefault();
    if (input.value == '') {
        alert('Ops ! it seems like you forgot somthing ;) \n Please put a valid url :)');
    } else {

        const newbookmark = new Bookmark();
        newbookmark.filterInput(input.value);
        newbookmark.displayBookmark();
        newbookmark.saveToLocal(newbookmark);

        // Clear input field
        input.value = '';
    }
}


// Events 
submit.addEventListener('click', init);

// Display saved bookmarkes
document.addEventListener('DOMContentLoaded', () => {
    const bkms = new Bookmark().getFromLocal();
    let bookmark = ' ';
    bkms.forEach(item => {
        bookmark += `
            <div class="bookmark">
                <div class="row">
                    <div class="name">${item.name}</div>
                    <div class="btns">
                        <div class="visit"><a href="${item.url}" target="_blanc" title="To ${item.name}">visit</a></div>
                         <button class="delete">Delete</button>
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
    new Bookmark().remove(el);
});