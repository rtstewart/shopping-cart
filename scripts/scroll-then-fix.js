/* https://css-tricks.com/scroll-fix-content/ */
/* https://developer.mozilla.org/en-US/docs/Web/Events/scroll */
/* https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop */

var showCart = document.querySelector('.show-cart-listing');
var scrolledY;
window.addEventListener('scroll', function(e) {
  // in case I want the scrolled value elsewhere
  // scrolledY = window.scrollY;
  // console.log(scrolledY);
  if (window.scrollY > 220) {
    showCart.classList.add('fix-show-cart');
  } else {
    showCart.classList.remove('fix-show-cart');
  }
});