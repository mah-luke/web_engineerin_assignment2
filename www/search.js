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