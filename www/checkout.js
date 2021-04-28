import * as StorageHandler from './storageHandler.js';
import * as Frame from './frame.js';
import {Artwork} from './artwork.js';
import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';

const subtotalPrice = 0;
const shippingCosts = 0;
const totalPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log("--load checkout--");
    checkout();
});

function checkout() {
    var cartItems = StorageHandler.getObject("cart")
    console.log(cartItems);
    if (!cartItems) {
        console.warn("cart is empty");
        window.location.replace("cart.html");
    } else {
        for(let i = cartItems.length - 1; i >= 0; i--){
            console.log(cartItems[i]);
            let cart = cartItems[i];
            subtotalPrice += Frame.calculatePrice(cart.printSize, cart.frameStyle, cart.frameWidth, cart.matWidth);           
            
        }
        const subtotal = document.getElementById("price-subtotal");
        subtotal.innerHTML = `Total: € ${Number(subtotalPrice/100).toFixed(2)}`;
    }
}

document.addEventListener("change", () =>{
    const select = document.getElementById("country");
    shippingCosts = Number($('#country').find(":selected").attr("data-cost"));

    const shipping = document.getElementById("price-shipping");
    shipping.innerHTML = `Total: € ${Number(shippingCosts/100).toFixed(2)}`;

    totalPrice = Number(subtotalPrice + shippingCosts);
    const total = document.getElementById("price-total");
    total.innerHTML = `Total: € ${Number(totalPrice/100).toFixed(2)}`;
});