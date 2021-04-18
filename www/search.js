/*
TODO: use query parameter q to store search term

TODO: Use MET API to search

TODO: load highlights if no searchterm was given (highlights.json) /done?

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

async function startSearch(searchInput) {
    console.log(`loadSearch(${searchInput.value})`);

    var gallery = document.getElementById('gallery');
    gallery.innerHTML = ""; // clear old search

    let artworkIds;
    // load highlights (empty search)
    if(!searchInput.value) {
        console.log("No search value given. Loading the highlights.");
        searchInput.style.border = '1px solid red'; //TODO: probably remove line
        artworkIds = await loadHighlights();
    }
    // load search results
    else {
        console.log(`Searching by value: '${searchInput.value}'`);
        artworkIds = await getArtworkSearch(searchInput.value);
    }

    console.debug(artworkIds);

    // create divs from artworkIds
    for(let artworkId of artworkIds){
        console.debug(artworkId);

        const artwork = await getArtworkObject(artworkId);
        const thumbDiv = createThumbElement(
            new Thumb(
                artwork.objectID,
                artwork.title,
                artwork.artistDisplayName,
                artwork.objectDate,
                artwork.primaryImage,
                `Picture: ${artwork.title}`
            )
        );
        gallery.appendChild(thumbDiv);
    }
}

async function loadHighlights() {
    console.log(`loadHighlights()`);

    await fetch("./highlights.json") // fetch highlights data
        .then(response => response.json())
        .then(json => {
            console.debug(json);
            hlJson = json}
        );
    return hlJson.highlights;
};

async function getArtworkObject(highlightId){
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${highlightId}`, {
        method: 'GET',
        // body: myBody,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const highlight = response.json();
    console.log(highlight);
    return highlight;
}

async function getArtworkSearch(searchParam){
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers`, {
        method: 'GET',
        // body: myBody,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    console.log(result);
    return result.objectIDs;
}

function createThumbElement(thumb) {
    console.log(`createThumbElement(${JSON.stringify(thumb)})`)
    
    const div = document.createElement('div');
    div.classList.add("thumb");
    
    // TODO: set correct link for href to framing.html
    div.innerHTML = 
    `<a href="framing.html/${thumb.id}">
    <img src="${thumb.imgUrl}" alt="${thumb.alt}">
    <div class="museum-label">
    <span class="artist">${thumb.artist}</span>
    <span class="title">${thumb.title}</span>,
    <span class="date">${thumb.date}</span>
    </div>
    </a>`;
    
    return div;
}

// Container to contain parameters for creating a Thumb
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