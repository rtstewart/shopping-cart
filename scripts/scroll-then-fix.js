/* https://css-tricks.com/scroll-fix-content/ */
/* https://developer.mozilla.org/en-US/docs/Web/Events/scroll */
/* https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop */
/* below is for the simple case where showCart is always on the RHS
    of the viewport */
// if (window.scrollY > 220) {
//   showCart.classList.add('fix-show-cart');
// } else {
//   showCart.classList.remove('fix-show-cart');
// }

var showCart = document.querySelector('.show-cart-listing');

window.addEventListener('scroll', function(e) {
  if (window.scrollY > 220) {
    if (window.innerWidth > 935) {
      showCart.classList.add('show-cart-lg-screen-fixed');
      showCart.classList.remove('show-cart-md-sm-screen-fixed');
      showCart.classList.remove('show-cart-not-fixed');
    } else {
      showCart.classList.add('show-cart-md-sm-screen-fixed');
        showCart.classList.remove('show-cart-lg-screen-fixed');
        showCart.classList.remove('show-cart-not-fixed');
    }
  } else {
      showCart.classList.add('show-cart-not-fixed');
      showCart.classList.remove('show-cart-lg-screen-fixed');
      showCart.classList.remove('show-cart-md-sm-screen-fixed');
  } // end if (window.scrollY > 220)
});

window.addEventListener('resize', function(e) {
  if (window.innerWidth > 935) {
    if (window.scrollY > 220) {
        showCart.classList.add('show-cart-lg-screen-fixed');
        showCart.classList.remove('show-cart-md-sm-screen-fixed');
        showCart.classList.remove('show-cart-not-fixed');
    } else {
        showCart.classList.add('show-cart-not-fixed');
        showCart.classList.remove('show-cart-md-sm-screen-fixed');
        showCart.classList.remove('show-cart-lg-screen-fixed');
    }
  } else if (window.scrollY > 220) {
      showCart.classList.add('show-cart-md-sm-screen-fixed');
      showCart.classList.remove('show-cart-not-fixed');
      showCart.classList.remove('show-cart-lg-screen-fixed');
  } else {
      showCart.classList.add('show-cart-not-fixed');
      showCart.classList.remove('show-cart-md-sm-screen-fixed');
      showCart.classList.remove('show-cart-lg-screen-fixed');
  } // end if (window.innerWidth > 935)
});