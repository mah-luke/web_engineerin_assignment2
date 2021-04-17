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

import { artwork } from "./artwork";

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
    console.log("loadHighlights()");
    
};

function createThumbElement(thumb) {
    const div = document.createElementlement('div');
    div.classList.add("thumb");

    div.innerHTML = 
        `<a href="framing.html">
        <img src="" alt="">
        <div class="museum-label">
            <span class="artist"></span>
            <span class="title"></span>
            <span class="date"></span>
        </div>
        </a>`;
}

