import * as StorageHandler from './storageHandler.js'

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
    }
}