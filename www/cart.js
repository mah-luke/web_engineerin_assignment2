import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import * as StorageHandler from './storageHandler.js';
import * as Frame from './frame.js';
import {Artwork} from './artwork.js';
import {CartItem} from './cartItem.js';
const cartSection = document.getElementById('cart');
console.log(cartSection);
var cartRemBtns;



document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    main();

    // add listeners for new buttons
    cartRemBtns = document.querySelectorAll('.cart-remove');
    console.log(cartRemBtns);
});


async function main() {
    var cartStorage = StorageHandler.getObject('cart');

    console.log(cartStorage);
    if(!cartStorage) {
        console.warn("Storage for cart empty!");

        cartSection.innerHTML = `There are no items in your shopping cart.`;
    }
    else {

        let btn = cartSection.lastElementChild;
        let checkout = cartSection.lastElementChild.previousElementSibling;
        let priceAll = 0;

        cartSection.innerHTML = "";

        for(let i = cartStorage.length - 1; i >= 0; i--){
            console.log(cartStorage[i]);
            cart = cartStorage[i];
            let artwork = ArtworkCache.retrieve(cart.objectID);
            if(!artwork) {
                let tmp = await MetApi.getArtworkObject(cart.objectID);

                if(tmp) {
                    artwork = new Artwork(
                        tmp.objectID,
                        tmp.title,
                        tmp.artistDisplayName,
                        tmp.objectDate,
                        tmp.primaryImageSmall,
                        `Picture: ${tmp.title}`
                    );
                    ArtworkCache.store(artwork);
                }
            }

            if(artwork){
                cartSection.appendChild(
                    createCartItem(
                        new CartItem(
                            artwork,
                            cart.printSize,
                            cart.frameStyle,
                            cart.frameWidth,
                            cart.matColor,
                            cart.matWidth
                        )
                    )
                );
                priceAll += Frame.calculatePrice(cart.printSize, cart.frameStyle, cart.frameWidth, cart.matWidth);
            }
            
        }


        checkout.innerHTML = `Total: € ${Number(priceAll/100).toFixed(2)}`;
        cartSection.appendChild(checkout);
        cartSection.appendChild(btn);

        cartRemBtns = document.querySelectorAll('.cart-remove');

        cartRemBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                let urlPic = new URL(event.target.parentElement.previousElementSibling.firstElementChild.href);
                let objectID = urlPic.searchParams.get('objectID');
                let cur = StorageHandler.getObject('cart');
                
                event.preventDefault();
                console.warn(`triggered Deleting. ObjectID: ${urlPic.searchParams.get('objectID')}`);
                console.log(urlPic);

                // filter element that gets deleted out of Storage
                console.log(cur);
                cur = cur.filter(cart => cart.objectID != objectID);
                console.log(cur);
                
                StorageHandler.store('cart', cur);
                // window.location.reload();
                let cartHeader = document.querySelector('[href="cart.html"]');
                console.log(cartHeader);
                cartHeader.innerHTML = `Cart${ cur.length > 0 ? ` (${cur.length})` : "" }`;
                main();
            })
        });
    }
}

function createCartItem(cart) {
   // console.log(`createCartItem(${JSON.stringify(cart)})`)

    let sizeDescr;
    switch(cart.printSize) {
        case "S": sizeDescr = "Small"; break;
        case "M": sizeDescr = "Medium"; break;
        case "L": sizeDescr = "Large"; break;

    }

    const div = document.createElement('div');
    div.classList.add("cart-item");    
    div.innerHTML = 
    `<div class="cart-preview">
      <a href="framing.html?objectID=${cart.artwork.id}&printSize=${cart.printSize}&frameStyle=${cart.frameStyle}&frameWidth=${cart.frameWidth}&matColor=${cart.matColor}&matWidth=${cart.matWidth}" alt="anchor for framing">
        <img class="cart-thumb" src="${cart.artwork.imgUrl}" alt="${cart.artwork.alt}" onload="">
      </a>
    </div>
    <div class="museum-label">
      <div>
        <span class="artist">${cart.artwork.artist}</span>
        <span class="title">${cart.artwork.title}</span>,
        <span class="date">${cart.artwork.date}</span>
        <br><br>
        <span class="frame-description">${sizeDescr} print in a ${cart.frameWidth / 10} cm ${cart.frameStyle} frame with a ${cart.matWidth / 10} cm ${cart.matColor} mat.</span>
      </div>
      <div class="price">€ ${Number(Frame.calculatePrice(cart.printSize, cart.frameStyle, cart.frameWidth, cart.matWidth)/100).toFixed(2)}</div>
      <button type="button" class="cart-remove" aria-label="Remove"></button>
    </div>`;
    
    return div;
}