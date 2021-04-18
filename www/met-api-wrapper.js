const getArtwork = async function getArtworkObject(highlightId){
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

// export default getArtwork;



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

    return result.total > 0? result.objectIDs.slice(0,100): null;
}