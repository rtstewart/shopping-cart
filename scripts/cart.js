// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

var cartHTML = '';

var itemCartHTML = '';

/* the main 2 pages to alternately display/hide */
var productListing = document.querySelector('.listing-container');
var cart = document.querySelector('.shopping-cart');

/* cart header and footer action elements */
var promoCodeInputArray = document.querySelectorAll('.shopping-cart .promo-code');
var applyPromoButtonsArray = document.querySelectorAll('.shopping-cart .apply-promo');
var keepShoppingButtonsArray = document.querySelectorAll('.shopping-cart .keep-shopping');
var checkoutButtonsArray = document.querySelectorAll('.shopping-cart .checkout');

/* cart item action elements */
var updateCartButtonsArray = document.querySelectorAll('.action-cart .update');
var removeButtonsArray = document.querySelectorAll('.action-cart .remove');
var seeDetailsButtonsArray = document.querySelectorAll('.action-cart .see-detail');

var i;

/* set up listeners for keep shopping button press */
for (i=0; i<keepShoppingButtonsArray.length; i++) {
  keepShoppingButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    cart.classList.add('hide');
    productListing.classList.remove('hide');
  });
}

/* Show Details/Hide Details */
for (i=0; i<seeDetailsButtonsArray.length; i++) {

  seeDetailsButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    /* get the sku data for this .item-cart */
    var sku = this.parentElement.parentElement.dataset.sku;
    var descriptiveTextDiv = document.querySelector('.item-cart[data-sku="' + sku + '"] .desc-text');
    console.log(this.parentElement.parentElement.dataset.sku);

    if (this.innerHTML == 'Show Details') {
      descriptiveTextDiv.classList.remove('hide');
      descriptiveTextDiv.classList.add('show');
      this.innerHTML = 'Hide Details';
    } else {
      descriptiveTextDiv.classList.remove('show');
      descriptiveTextDiv.classList.add('hide');
      this.innerHTML = 'Show Details';
    }

  });

} // end for (var i=0; i<seeDetailsButtonsArray.length; i++)