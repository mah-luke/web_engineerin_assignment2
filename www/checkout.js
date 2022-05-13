import * as StorageHandler from './storageHandler.js';
import * as Frame from './frame.js';
import {Artwork} from './artwork.js';
import * as ArtworkCache from  './artwork-cache.js';
import * as MetApi from './met-api-wrapper.js';

var subtotalPrice = 0;
var shippingCosts = 1500;
var totalPrice = 0;

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
        subtotal.innerHTML = `${Number(subtotalPrice/100).toFixed(2)}`;

        const shipping = document.getElementById("price-shipping");
        shipping.innerHTML = `${Number(shippingCosts/100).toFixed(2)}`;

        totalPrice = Number(subtotalPrice + shippingCosts);
        const total = document.getElementById("price-total");
        total.innerHTML = `${Number(totalPrice/100).toFixed(2)}`;
    }
}

document.getElementById("country").addEventListener("change", () =>{
    var select = document.getElementById("country");
    console.log(select.options);
    shippingCosts = Number(select.options[select.selectedIndex].dataset.cost);
    console.log(shippingCosts);

    const shipping = document.getElementById("price-shipping");
    shipping.innerHTML = `${Number(shippingCosts/100).toFixed(2)}`;

    totalPrice = Number(subtotalPrice + shippingCosts);
    const total = document.getElementById("price-total");
    total.innerHTML = `${Number(totalPrice/100).toFixed(2)}`;
});