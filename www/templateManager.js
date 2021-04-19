const cart = document.querySelector('[href="cart.html"]');

// events
document.addEventListener('DOMContentLoaded', () => {    
    const size = getSize('cart');
    cart.innerHTML = `Cart${ size > 0 ? ` (${size})` : "" }`;
});