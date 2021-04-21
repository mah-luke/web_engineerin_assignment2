import * as StorageHandler from './storageHandler.js';

const cartHeader = document.querySelector('[href="cart.html"]');

// events

document.addEventListener('DOMContentLoaded', () => {    
    const size = StorageHandler.getSize('cart');
    cartHeader.innerHTML = `Cart${ size > 0 ? ` (${size})` : "" }`;
});