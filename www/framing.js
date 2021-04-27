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

export function update(matColor, frameStyle, printSize, frameWidth, matWidth) {
    setMatColor(matColor);
    setFrameStyle(frameStyle);
    setPrintSize(printSize);
    document.getElementById("frameValue").value = frameWidth/10;
    document.getElementById("frameSlider").value = frameWidth/10;
    document.getElementById("matWidth").value = matWidth/10;
    document.getElementById("matSlider").value = matWidth/10;
}

function setMatColor(matColor) {

    const containers = document.querySelectorAll('.mat-color-item');
    console.log(containers);
    for (let index = 0; index < containers.length; index++) {
        if (containers[index].firstElementChild.value === matColor) {
            containers[index].firstElementChild.checked = true;
            break;

        }

    }

}

function setFrameStyle(frameStyle) {

    const containers = document.querySelectorAll('.frame-style-item');
    console.log(containers);
    for (let index = 0; index < containers.length; index++) {

        if (containers[index].firstElementChild.value === frameStyle) {
            containers[index].firstElementChild.checked = true;
            break;

        }

    }


}

function setPrintSize(printSize) {

    const small = document.getElementById("print-size-s")
    const medium = document.getElementById("print-size-m")
    const large = document.getElementById("print-size-l")

    if (small.value == printSize) {
        small.checked = true;

    } else if (medium.value == printSize) {
        medium.checked = true;

    } else {
        large.checked = true;
    }

}