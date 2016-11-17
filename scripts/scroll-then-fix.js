var showCart = document.querySelector('.show-cart-listing');

window.addEventListener('scroll', function(e) {
  console.log(window.scrollY);
  if (window.scrollY > 220) {
    showCart.classList.add('fix-show-cart');
  } else {
    showCart.classList.remove('fix-show-cart');
  }
});