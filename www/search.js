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

import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import {Artwork} from './artwork.js';

const form = document.querySelector('form.search-form');
const CURRENT_URL = new URL(window.location.href);

// events

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    search(CURRENT_URL.searchParams.get('q'));
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
        artworkIds = await MetApi.getArtworkSearch(searchInput, true);
    }

    console.debug(artworkIds);
    
    // create divs from artworkIds
    if(artworkIds){
        if(searchInput) searchInfo.innerHTML = `Found ${artworkIds.length} artwork${artworkIds.length > 1? "s": ""} for “${searchInput}”`;
        artworkIds = artworkIds.slice(0,100); // max cap
        for(let artworkId of artworkIds){
            var artwork = ArtworkCache.retrieve(artworkId);

            if(artwork){
                console.warn("loading from cache");
                gallery.appendChild( createThumbElement( artwork));
            }
            else {
                console.warn("loading from api");
                MetApi.getArtworkObject(artworkId)
                .then( response => {
                    let tmpArtwork = new Artwork(
                        response.objectID,
                        response.title,
                        response.artistDisplayName,
                        response.objectDate,
                        response.primaryImageSmall,
                        `Picture: ${response.title}`,
                        response.primaryImage
                    );
                    gallery.appendChild(createThumbElement(tmpArtwork));
                    ArtworkCache.store(tmpArtwork);
                });
            }
        }
    }
    else searchInfo.innerHTML = `Found 0 artwork for ${searchInput}`;
}

async function getHighlights() {
    console.log(`loadHighlights()`);
    let hlJson;

    await fetch("./highlights.json") // fetch highlights data
        .then(response => response.json())
        .then(json => {
            console.debug(json);
            hlJson = json;
        });
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