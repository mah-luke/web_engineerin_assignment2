import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import * as Frame from './frame.js';
import {CartItem} from './cartItem.js';
import {Artwork} from './artwork.js';

const CURRENT_URL = new URL(window.location.href);
const objectId = CURRENT_URL.searchParams.get('objectID');
const previewContainer = document.getElementById("preview-container");
const previewImg = document.getElementById('preview-image');
var cartItem = null;

document.getElementById("toCartBtn").addEventListener("click", event => {
    console.log("submit to cart");
    event.preventDefault;
})

export async function init() {
    console.log(`init of framing`);

    var artwork = ArtworkCache.retrieve(objectId);
    if (!artwork){
        console.warn("Artwork not cached!");
        let artworkTmp = await MetApi.getArtworkObject(objectId);

        if (!artworkTmp) {
            console.warn("image not found! Redirecting to search...");
            window.location.replace("search.html");
        }
        
        artwork = new Artwork(
            artworkTmp.objectID,
            artworkTmp.title,
            artworkTmp.artistDisplayName,
            artworkTmp.objectDate,
            artworkTmp.primaryImageSmall,
            `Picture: ${artworkTmp.title}`,
            artworkTmp.primaryImage
        )


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
        params.get("printSize")? params.get("printSize") : 'M',
        params.get("frameStyle")? params.get("frameStyle") : 'natural',
        params.get("frameWidth")? params.get("frameWidth"): 40,
        params.get("matColor")? params.get("matColor") : 'ivory',
        params.get("matWidth")? params.get("matWidth"): 55
    );

    console.log(cartItem);

    updateDom();
    render();
}

export function render() {
    console.log("render of framing");

    console.log(cartItem);
    updateCartItem();
    console.log(cartItem);

    // set DOM according to cartItem
    const printSizes = Frame.getPrintSizes(previewImg);
    const totalWidth = printSizes[cartItem.printSize][0] + 2 * cartItem.frameWidth + 2 * cartItem.matWidth;
    const totalHeight = printSizes[cartItem.printSize][1] + 2 * cartItem.frameWidth + 2 * cartItem.matWidth;
    document.getElementById("print-size-s-label").innerHTML = `Small <br>${printSizes['S'][0] / 10} × ${printSizes['S'][1] / 10} cm`
    document.getElementById("print-size-m-label").innerHTML = `Medium<br>${printSizes['M'][0] / 10} × ${printSizes['M'][1] / 10} cm`
    document.getElementById("print-size-l-label").innerHTML = `Large <br>${printSizes['L'][0] / 10} × ${printSizes['L'][1] / 10} cm`
    document.getElementById('total-size').innerHTML = `${totalWidth / 10} × ${totalHeight / 10} cm`;
    document.getElementById('price').innerHTML = `€ ${Number(Frame.calculatePrice(cartItem.printSize, cartItem.frameStyle, cartItem.frameWidth, cartItem.matWidth)/100).toFixed(2)}`;

    Frame.render(previewImg, previewContainer, cartItem.printSize, cartItem.frameStyle, cartItem.frameWidth, cartItem.matColor, cartItem.matWidth);

    // load update into DOM
    updateDom();
}

function updateCartItem() {
    cartItem.printSize = document.querySelector('input[name="printSize"]:checked').value;
    cartItem.frameStyle = document.querySelector('input[name="frameStyle"]:checked').value;
    cartItem.matColor = document.querySelector('input[name="matColor"]:checked').value;

    let fw = 10 * document.querySelector('input[name="frameWidth"]').value;
    let fwR = 10 * document.querySelector('input[name="frameWidthR"]').value;
    cartItem.frameWidth = fw != cartItem.frameWidth? fw: fwR;
 
    let mw = 10 * document.querySelector('input[name="matWidth"]').value;
    let mwR = 10 * document.querySelector('input[name="matWidthR"]').value;
    cartItem.matWidth = mw != cartItem.matWidth? mw : mwR;
}

function updateDom() {
    console.log("updating dom");

    console.log(cartItem);

    document.getElementById(`print-size-${cartItem.printSize.toLowerCase()}`).checked = true; // printSize
    document.getElementById(`frame-style-${cartItem.frameStyle}`).checked = true; // frameStyle
    document.getElementById(`mat-color-${cartItem.matColor}`).checked = true; // matColor


    document.getElementById("frameValue").value = cartItem.frameWidth/10;
    document.getElementById("frameSlider").value = cartItem.frameWidth/10;
    document.getElementById("matWidth").value = cartItem.matWidth/10;
    document.getElementById("matSlider").value = cartItem.matWidth/10;
}