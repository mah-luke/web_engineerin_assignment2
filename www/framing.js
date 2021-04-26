import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import * as Frame from './frame.js';

const CURRENT_URL = new URL(window.location.href);
const objectId = CURRENT_URL.searchParams.get('objectID');

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    framing();
    
});

async function framing() {
    console.log("prova")
    var cachedPic = ArtworkCache.retrieve(objectId);
    if (!cachedPic){
        console.log("ArtworkCache search failed")
        cachedPic = await MetApi.getArtworkObject(objectId);
        console.log(cachedPic);
        if (!cachedPic) {
            console.log("image not found")
            window.location.replace("search.html");
        }
        ArtworkCache.store(cachedPic);
    }
    console.log(cachedPic.imgUrlBig)
    document.getElementById('preview-image').src = cachedPic.imgUrl;
    document.getElementById('preview-image').alt = cachedPic.alt;
    const div = document.getElementById('image-label');

    div.innerHTML = 
    `<span class="artist">${cachedPic.artist}</span>
     <span class="title">${cachedPic.title}</span>,
     <span class="date">${cachedPic.date}</span>
     </div>
     </a>`;
    
     

}