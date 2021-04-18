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

// events

form.addEventListener('submit', event => { 
    console.log("--- Search started ---");
    
    event.preventDefault();
    startSearch(document.getElementById('search'));
});

// functions

function startSearch(searchInput) {
    console.log(`loadSearch(${searchInput.value})`);

    // clear old search
    gallery = document.getElementById('gallery').innerHTML = "";

    // load highlights (empty search)
    if(!searchInput.value) {
        console.log("No search value given. Loading the highlights.");
        searchInput.style.border = '1px solid red'; //TODO: probably remove line
        loadHighlights();
    }
    // load search results
    else {
        console.log(`Searching by value = ${searchInput.value}`);
        loadSearch();
    } 
}

async function loadHighlights() {
    console.log(`loadHighlights()`);

    const gallery = document.getElementById('gallery');
    await fetch("./highlights.json") // fetch highlights data
        .then(response => response.json())
        .then(json => {
            console.debug(json);
            hlJson = json}
        );

    for(let highlight of hlJson.highlights){
        console.debug(highlight);

        //TODO: add API call to fill divs with correct information
        const thumbDiv = createThumbElement(
            new Thumb(highlight)
        );

        gallery.appendChild(thumbDiv);
    }
};

async function loadSearch() {
    console.log(`loadSearch()`);


}

function createThumbElement(thumb) {
    console.log(`createThumbElement(${JSON.stringify(thumb)})`)
    
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