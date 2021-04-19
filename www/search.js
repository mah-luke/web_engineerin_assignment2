/*
TODO: use query parameter q to store search term /done

TODO: Use MET API to search /done

TODO: load highlights if no searchterm was given (highlights.json) /done?

TODO: Consider only artworks that have images /done

TODO: Return only the first 100 per search /done

TODO: Link the artwork image of each result to the corresponding Framing page /done?

TODO: Replace 'search our collection of...' with actual search term 'Searching for "<term>"'
when the search is done: 'Found <number> artworks for "<term>"'
watch out for plural (artwork vs artworks)
*/

// import { getArtwork} from './met-api-wrapper.js';

const form = document.querySelector('form.search-form');
const cart = document.querySelector('[href="cart.html"]');
const CURRENT_URL = new URL(window.location.href);

// events

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    search(CURRENT_URL.searchParams.get('q'));
    const cartStorage = localStorage.getItem('cart');
    console.log(cartStorage);

    if(cartStorage == null) cart.innerHTML = 'Cart';
    else cart.innerHTML = `Cart (${JSON.parse(cartStorage).length})`;
});

form.addEventListener('submit', event => {
    console.debug("--- Search triggered ---");

    event.preventDefault();
    window.location.search = `?q=${document.getElementById('search').value}`;
});

// functions

async function search(searchInput) {
    console.log(`search(${searchInput})`);

    var gallery = document.getElementById('gallery');
    var searchInfo = document.getElementById('search-info');
    gallery.innerHTML = ""; // clear old search
    let artworkIds;

    // load highlights (empty search)
    if(!searchInput) {
        console.log("No search value given. Loading the highlights.");
        searchInfo.innerHTML = `Search our collection of more than 400,000 artworks.`;
        artworkIds = await getHighlights();
    }
    // load search results
    else {
        console.log(`Searching by value: '${searchInput}'`);
        searchInfo.innerHTML = `Searching for "${searchInput}"`;
        artworkIds = await getArtworkSearch(searchInput, true);
    }

    console.debug(artworkIds);
    
    // create divs from artworkIds
    if(artworkIds){
        if(searchInput) searchInfo.innerHTML = `Found ${artworkIds.length} artwork${artworkIds.length > 1? "s": ""} for "${searchInput}"`;
        artworkIds = artworkIds.slice(0,100); // max cap
        for(let artworkId of artworkIds){
            const artwork = getArtworkObject(artworkId)
            .then(artwork => {
                gallery.appendChild(
                    createThumbElement(
                        new Thumb(
                            artwork.objectID,
                            artwork.title,
                            artwork.artistDisplayName,
                            artwork.objectDate,
                            artwork.primaryImageSmall,
                            `Picture: ${artwork.title}`
                        )
                    )
                )
            });
        }
    }
    else {
        searchInfo.innerHTML = `Found no artwork for ${searchInput}`;
    }
}

async function getHighlights() {
    console.log(`loadHighlights()`);

    await fetch("./highlights.json") // fetch highlights data
        .then(response => response.json())
        .then(json => {
            console.debug(json);
            hlJson = json}
        );
    return hlJson.highlights;
};

function createThumbElement(thumb) {
    console.log(`createThumbElement(${JSON.stringify(thumb)})`)
    
    const div = document.createElement('div');
    div.classList.add("thumb");
    
    div.innerHTML = 
    `<a href="framing.html?objectID=${thumb.id}">
    <img src="${thumb.imgUrl}" alt="${thumb.alt}">
    <div class="museum-label">
    <span class="artist">${thumb.artist}</span>
    <span class="title">${thumb.title}</span>,
    <span class="date">${thumb.date}</span>
    </div>
    </a>`;
    
    return div;
}

class Thumb {
    constructor(id, title, artist, date, imgUrl, alt) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.date = date;
        this.imgUrl = imgUrl;
        this.alt = alt;
    }
}