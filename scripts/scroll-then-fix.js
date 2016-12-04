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

/* .show-cart-listing has been casually named Igor */
function showIgor() {
  showCart.classList.remove('hide');
}

/* I will make the current scrolled Y position available globally */
var scrolledY = 0;

window.addEventListener('scroll', function(e) {
  scrolledY = window.scrollY;
  console.log(scrolledY);
  /* hide showCart, then unhide after 250ms;
      this makes the "teleportation" between states not displayed; */
  showCart.classList.add('hide')
  setTimeout(showIgor, 250);
  if (window.scrollY > 275) {
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
  showCart.classList.add('hide');
  setTimeout(showIgor, 250);
  if (window.innerWidth > 935) {
    if (window.scrollY > 275) {
        showCart.classList.add('show-cart-lg-screen-fixed');
        showCart.classList.remove('show-cart-md-sm-screen-fixed');
        showCart.classList.remove('show-cart-not-fixed');
    } else {
        showCart.classList.add('show-cart-not-fixed');
        showCart.classList.remove('show-cart-md-sm-screen-fixed');
        showCart.classList.remove('show-cart-lg-screen-fixed');
    }
  } else if (window.scrollY > 275) {
      showCart.classList.add('show-cart-md-sm-screen-fixed');
      showCart.classList.remove('show-cart-not-fixed');
      showCart.classList.remove('show-cart-lg-screen-fixed');
  } else {
      showCart.classList.add('show-cart-not-fixed');
      showCart.classList.remove('show-cart-md-sm-screen-fixed');
      showCart.classList.remove('show-cart-lg-screen-fixed');
  } // end if (window.innerWidth > 935)
});