var itemQuantityArray = document.querySelectorAll('.item-listing .quantity');
var addToCartButtonArray = document.querySelectorAll('.item-listing .add-to-cart');
var showCartButtonInListing = document.querySelector('.listing-container .show-cart-listing');
var productListing = document.querySelector('.listing-container');
var cart = document.querySelector('.shopping-cart');

// for (var i=0; i<addToCartButtonArray.length; i++) {
//   addToCartButtonArray[i].addEventListener('click',
//     (function(i) {
//       return function(event) {
//         event.preventDefault();
//         console.log('Adding:',itemQuantityArray[i].value);
//       };
//     })(i)
//   );
// } // end for

for (var i=0; i<addToCartButtonArray.length; i++) {
  addToCartButtonArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    var thisSku = this.parentElement.parentElement.parentElement.dataset.sku;
    var associatedQuantityInput = this.parentElement.querySelector('.quantity');
    var thisQuantity = associatedQuantityInput.value;
    this.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Item in cart';
    /* disable button and input */
    associatedQuantityInput.setAttribute('disabled', 'disabled');
    this.setAttribute('disabled', 'disabled');
    console.log('Adding:', thisQuantity, ' of ', thisSku);
  })
} // end for

/* set up listener for .show-cart-listing */
showCartButtonInListing.addEventListener('click', function(event) {
  productListing.classList.add('hide');
  cart.classList.remove('hide');
});