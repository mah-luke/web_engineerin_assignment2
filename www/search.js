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

const form = document.querySelector('form.search-form')


form.addEventListener('submit', event => { 
    event.preventDefault();

    console.log("Search pressed");
    const searchInput = document.getElementById('search');
    if(!searchInput.value) {
        searchInput.style.border = '1px solid red';
    }
    console.log(`Searching by value = ${searchInput.value}`);
})