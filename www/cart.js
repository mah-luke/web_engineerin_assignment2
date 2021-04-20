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
import {Artwork} from './artwork.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- load site ---");
    main();
});

function main() {
    var cartStorage = StorageHandler.getObject('cart');

    console.log(cartStorage);
    if(!cartStorage) {
        console.warn("Storage for cart empty!");
    }

    

}