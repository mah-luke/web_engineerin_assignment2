import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import * as Frame from './frame.js';
import {CartItem} from './cartItem.js';

const CURRENT_URL = new URL(window.location.href);
const objectId = CURRENT_URL.searchParams.get('objectID');
const previewImg = document.getElementById('preview-image');

var cartItem = null;

export async function init() {
    var artwork = ArtworkCache.retrieve(objectId);
    if (!artwork){
        console.log("Artwork not cached!");
        artwork = await MetApi.getArtworkObject(objectId);
        console.log(artwork);

        if (!artwork) {
            console.warn("image not found");
            window.location.replace("search.html");
        }
        
        ArtworkCache.store(artwork);
    }

    previewImg.src = artwork.imgUrl;
    previewImg.alt = artwork.alt;
    const div = document.getElementById('image-label');

    div.innerHTML = 
    `<span class="artist">${artwork.artist}</span>
     <span class="title">${artwork.title}</span>,
     <span class="date">${artwork.date}</span>`;


    let params = CURRENT_URL.searchParams;
    cartItem = new CartItem(
        artwork,
        params.get("printSize")? params.get("printSize") :  'M',
        params.get("frameStyle")? params.get("frameStyle") : 'natural',
        params.get("frameWidth")? params.get("frameWidth"): 40,
        params.get("matColor")? params.get("matColor") : 'ivory',
        params.get("matWidth")? params.get("matWidth"): 55
    );
}

export function render() {

    let previewContainer = document.getElementById("preview-container");
    console.log(params);

    const printSizes = Frame.getPrintSizes(previewImg);
    const totalWidth = printSizes[cartItem.printSize][0] + 2 * cartItem.frameWidth + 2 * cartItem.matWidth;
    const totalHeight = printSizes[cartItem.printSize][1] + 2 * cartItem.frameWidth + 2 * cartItem.matWidth;
    document.getElementById("print-size-s-label").innerHTML = `Small <br>${printSizes['S'][0] / 10} × ${printSizes['S'][1] / 10} cm`
    document.getElementById("print-size-m-label").innerHTML = `Medium<br>${printSizes['M'][0] / 10} × ${printSizes['M'][1] / 10} cm`
    document.getElementById("print-size-l-label").innerHTML = `Large <br>${printSizes['L'][0] / 10} × ${printSizes['L'][1] / 10} cm`
    document.getElementById('total-size').innerHTML = `${totalWidth / 10} × ${totalHeight / 10} cm`;

    // TODO: render picture frame
    Frame.render(previewImg, previewContainer, cartItem.printSize, cartItem.frameStyle, cartItem.frameWidth, cartItem.matColor, cartItem.matWidth);
    
    // TODO: update price

}

function update(matColor, frameStyle, printSize, frameWidth, matWidth) {
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