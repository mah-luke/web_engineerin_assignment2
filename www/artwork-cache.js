export function retrieve(artworkId) {
    if(artworkId in localStorage) {
        let ret = JSON.parse(localStorage[artworkId]);
        //console.log(ret);
        return ret;
    }
}

export function store(artwork) {
    localStorage[artwork.id] = JSON.stringify(artwork);
}