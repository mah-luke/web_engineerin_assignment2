/*
TODO: use query parameter q to store search term

TODO: Use MET API to search

TODO: load highlights if no searchterm was given (highlights.json)

TODO: Consider only artworks that have images

TODO: Return only the first 100 per search

TODO: Link the artwork image of each result to the corresponding Framing page

TODO: Reaplace 'search our collection of...' with actual search term 'Searching for "<term>"'
        when the search is done: 'Found <number> artworks for "<term>"'
        watch out for plural (artwork vs artworks)
*/

const form = document.querySelector('form.search-form');

form.addEventListener('submit', event => { 
    event.preventDefault();

    console.log("Search pressed");
    const searchInput = document.getElementById('search');

    // load only highlights
    if(!searchInput.value) {
        console.log("No search value given. Loading the highlights");
        searchInput.style.border = '1px solid red';
        loadHighlights();
    }
    // load search results
    else {
        console.log(`Searching by value = ${searchInput.value}`);
    } 
});

function loadHighlights() {
    console.log(`loadHighlights()`);

    const gallery = document.getElementById('gallery');
    const thumb = new Thumb("testTitle", "testArtist", "2021-05-21", "www.test.com", "test alt");
    const thumbDiv = createThumbElement(thumb);

    console.log(thumbDiv);
    gallery.appendChild(thumbDiv);
};

function createThumbElement(thumb) {
    console.log(`Creating thumb element: ${JSON.stringify(thumb)}`)
    
    const div = document.createElement('div');
    div.classList.add("thumb");
    
    // TODO: set correct link for href to framing.html
    div.innerHTML = 
    `<a href="framing.html/${thumb.href}">
    <img src="${thumb.url}" alt="${thumb.alt}">
    <div class="museum-label">
    <span class="artist">${thumb.artist}</span>
    <span class="title">${thumb.title}</span>
    <span class="date">${thumb.date}</span>
    </div>
    </a>`;
    
    return div;
}

// Container to contain parameters for creating a Thumb
class Thumb {
    constructor(title, artist, date, href, imgUrl, alt) {
        this.title = title;
        this.artist = artist;
        this.date = date;
        this.href = href;
        this.imgUrl = imgUrl;
        this.alt = alt;
    }
}