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

let loading = false;
const form = document.querySelector('form.search-form');

// events

form.addEventListener('submit', event => {
    console.log("--- Search triggered ---");

    event.preventDefault();
    search(document.getElementById('search').value);
});

// functions

async function search(searchInput) {
    console.log(`search(${searchInput})`);

    if(!loading) {
        loading = true;
        var gallery = document.getElementById('gallery');
        var searchInfo = document.getElementById('search-info');
        gallery.innerHTML = ""; // clear old search
        searchInfo.innerHTML = `Searching for "${searchInput}"`;

        let artworkIds;



        // load highlights (empty search)
        if(!searchInput) {
            console.log("No search value given. Loading the highlights.");
            artworkIds = await loadHighlights();
        }
        // load search results
        else {
            console.log(`Searching by value: '${searchInput}'`);
            artworkIds = await getArtworkSearch(searchInput, true);
        }

        console.debug(artworkIds);
        
        // create divs from artworkIds
        if(artworkIds){
            searchInfo.innerHTML = `Found ${artworkIds.length} artwork${artworkIds.length > 1? "s": ""} for "${searchInput}"`;
            artworkIds = artworkIds.slice(0,100); 
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
        else {
            //TODO: errorcode no image found
            searchInfo.innerHTML = `Found no artwork for ${searchInput}`;
        }

        loading = false;
        console.warn(loading);
    } else {
        console.warn(`Search for parameter '${searchInput}' aborted because old search is still running!`);

        //TODO: errorcode old search still running
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

// API calls
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

async function getArtworkSearch(searchParam, hasImages){
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchParam}&hasImages=${hasImages}`, {
        method: 'GET',
        // body: myBody,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();

    console.log(result);

    return result.total > 0? result.objectIDs: null;
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