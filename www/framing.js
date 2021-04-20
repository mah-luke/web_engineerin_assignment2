import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';

const CURRENT_URL = new URL(window.location.href);
const objectId = CURRENT_URL.searchParams.get('objectID');

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    framing();
    
});

async function framing() {
    console.log("prova")
    if (ArtworkCache.retrieve(objectId) == null){
        console.log("ArtworkCache failed")
        var response = await MetApi.getArtworkObject(objectId);
        if (response == null) {
            console.log("image")
            window.location.href = "www/search.html"
        }
    }



}