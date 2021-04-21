/*

    Use the local storage key cart to store the shopping cart.
    You should represent the cart as a JSON array of objects containing an objectID and the framing parameters, but nothing more.
    In particular, the cart should not contain the artwork metadata or the calculated price of each item.
    For each item in the cart, show a preview of the framed artwork using the Met API and the helper functions in frame.js. The preview image should link to the corresponding Framing page.
    For each item in the cart, show the usual metadata (artist, title, date) and a textual description of the configuration. The description should be like "Medium print in a 3.3 cm natural frame with a 1.7 cm mint mat." or "Small print in a 5 cm classic frame." (if the mat has width zero).
    Show the price of each item, as well as the sum total.
    Allow the user to remove items from the cart by clicking on the circled "x". Removing an item from the cart should not cause the page to reload.
    Display the most recently added item on top.
    If there are no items in the cart, show the message "There are no items in your shopping cart." and nothing else (except for the usual page header).


*/

import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';
import * as StorageHandler from './storageHandler.js';
import * as Frame from './frame.js';
import {Artwork} from './artwork.js';
import {CartItem} from './cartItem.js';
const cartSection = document.getElementById('cart');
const cartHeader = document.querySelector('[href="cart.html"]');
console.log(cartSection);
var cartRemBtns;



document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    
    
    main();

    // add listeners for new buttons
    cartRemBtns = document.querySelectorAll('.cart-remove');
    console.log(cartRemBtns);

    cartRemBtns.forEach(btn => {
        console.warn(btn);
        btn.addEventListener('click', event => {
            console.warn(event);
            event.preventDefault();

            let urlPic = new URL(event.target.parentElement.previousElementSibling.firstElementChild.href);
            console.log(urlPic);
            let objectID = urlPic.searchParams.get('objectID');
            let cur = StorageHandler.getObject('cart');
            console.log(cur);
            cur = cur.filter(cart => cart.objectID != objectID); /// get this objectid
            console.log(cur);
            
            StorageHandler.store('cart', cur);
            main();
            console.log(cartHeader);
            cartHeader.innerHTML = `Cart${ cur.length > 0 ? ` (${cur.length})` : "" }`;
        })
    });
    

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

        for(let cart of cartStorage){
            console.log(cart);
            //let artwork;
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