// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

/* IMPORTANT NOTE: the following declarations and assignments are used because
    the listing information is already present;
    normally, for search results, the listing information would be populated
    dynamically, in which case, DOM elements would have to be defined then;
    Most if not all of the DOM elements used and referenced here would have been
    dynamically created and so, in an actual application, much of what occurs
    in this "mock" shopping environment would have to be handled differently.
*/

/* the main 2 pages to alternately display/hide */
var productListing = document.querySelector('.listing-container');
var cartListing = document.querySelector('.shopping-cart');

/* show cart buttons/widgets within Supercycles nav, and .listing-container */
var showCartButtonInMain = document.querySelector('nav .show-cart-main');
var showCartButtonInListing = document.querySelector('.listing-container .show-cart-listing');
/* disable the show cart buttons initially, and when total cart items is zero */
showCartButtonInMain.disabled = true;
showCartButtonInListing.disabled = true;

var cartTotalQuantityMain = document.querySelector('div.cart-quantity-all-main');
var cartTotalQuantityListing = document.querySelector('div.cart-quantity-all-listing');

/* listing item action elements */
var itemQuantityArray = document.querySelectorAll('.item-listing .quantity');
var addToCartButtonArray = document.querySelectorAll('.item-listing .add-to-cart');

var i; // loop variable
var key; // loop variable for objects

/***********************************/
/* below - cart-specific variables */
/***********************************/

/* cartItems {} will have the following structure:

    {
      sku:quantity,
      .
      .
      .
      sku:quantity
    }
*/
var cartItems = {};
// var numCartItems = 0;
// var cartSubtotal = 0;
// var cartTotal = 0;

/* cart header and footer, and associated action elements */
/* NOTE in our "mock" shopping scenario here, these elements already exist in
    the DOM so we can reference them already;
    Normally, they might be created dynamically and would have to be dealt with
    more like the cart items below with regard to event listeners and so forth.
*/
var cartHeader = document.querySelector('div.cart-header');
var cartFooter = document.querySelector('div.cart-footer');
var promoCodeInputArray = document.querySelectorAll('.shopping-cart .promo-code');
var applyPromoButtonsArray = document.querySelectorAll('.shopping-cart .apply-promo');
var keepShoppingButtonsArray = document.querySelectorAll('.shopping-cart .keep-shopping');
var checkoutButtonsArray = document.querySelectorAll('.shopping-cart .checkout');

/* cart item action elements - these will have to dealt with as they are
    actually added to the DOM
*/
var updateCartButtonsArray = document.querySelectorAll('.action-cart .update');
var removeButtonsArray = document.querySelectorAll('.action-cart .remove');
var showDetailsButtonsArray = document.querySelectorAll('.action-cart .see-detail');


/***********************************/
/* above - cart-specific variables */
/***********************************/

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

for (i=0; i<addToCartButtonArray.length; i++) {
  addToCartButtonArray[i].addEventListener('click', function(event) {

    /* a button element by default will be treated as submit, so ... */
    event.preventDefault();

    var sku = this.parentElement.parentElement.parentElement.dataset.sku;
    var associatedQuantityInput = this.parentElement.querySelector('.quantity');

    /* change text on Add to Cart button, and disable it and the associated input */
    var quantity = associatedQuantityInput.value;
    this.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Item in cart';
    /* disable button and input */
    associatedQuantityInput.disabled = true;
    this.disabled = true;

    /* create and add item node to cart */
    var nodeToInsert = makeCartItemNode(sku, quantity);
    /* https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore */
    cartListing.insertBefore(nodeToInsert, cartFooter);

    /* update cartItems object with new item addition */
    cartItems[sku] = quantity;

    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    for (key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }

    /* update .cart-quantity-all in Supercycles, and widget in listing */
    cartTotalQuantityMain.innerHTML = cartNumItems.toString();
    cartTotalQuantityListing.innerHTML = cartNumItems.toString();

    /* enable show cart buttons/widgets */
    showCartButtonInMain.disabled = false;
    showCartButtonInListing.disabled = false;

    /* create event listeners for action elements in this cart item
        NOW THAT IT IS IN THE DOM */

    /* Update Cart button event listener and routine */

    /* Remove item button event listener and routine */
    var removeItemButton = document.querySelector('.shopping-cart div[data-sku="' + sku + '"] .action-cart button.remove');

    console.log('removeItemButton:', removeItemButton);

    removeItemButton.addEventListener('click', function(event) {
      event.preventDefault();

      var associatedCartItem =  this.parentElement.parentElement;
      console.log('associatedCartItem:', associatedCartItem);

      var sku = this.parentElement.parentElement.dataset.sku;
      delete cartItems[sku];

      /* get total number of items in cartItems object */
      var cartNumItems = 0;
      for (key in cartItems) {
        cartNumItems += parseInt(cartItems[key]);
      }

      /* update .cart-quantity-all in Supercycles, and widget in listing */
      cartTotalQuantityMain.innerHTML = cartNumItems.toString();
      cartTotalQuantityListing.innerHTML = cartNumItems.toString();

      if (cartNumItems == 0) {
        /* disable show cart buttons/widgets */
        showCartButtonInMain.disabled = true;
        showCartButtonInListing.disabled = true;
      }

      /* reset the listing for this item with regard to:
          Quantity input value reset to 1,
          Quantity input enabled,
          "Item in cart" button text reset to "Add to cart",
          Add to cart button enabled
      */
      var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
      console.log('associatedListingItem:', associatedListingItem);
      associatedListingItem.querySelector('input.quantity').value = '1';
      associatedListingItem.querySelector('input.quantity').disabled = false;
      associatedListingItem.querySelector('button.add-to-cart').innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Add to cart';
      associatedListingItem.querySelector('button.add-to-cart').disabled = false;

      /* remove the cart item from the DOM */
      associatedCartItem.parentElement.removeChild(associatedCartItem);
    });

    /* Show Details button event listener and routine */

    console.log('Adding:', quantity, ' of ', sku);
  })
} // end for

/* this will be called by the listener for the Add to cart button of a particular item */
function addItemToCartObj(sku, quantity) {

}

function removeItemFromCartObj(sku) {

}

function removeItemButton(event) {

}

/* set up event listeners for show cart buttons/widgets */
showCartButtonInMain.addEventListener('click', function(event) {
  productListing.classList.add('hide');
  cartListing.classList.remove('hide');
});
/* this DOM element would normally be created dynamically when the listing
    page gets populated dynamically;
    in our case, it exists on initial page load, so we can reference it;
*/
showCartButtonInListing.addEventListener('click', function(event) {
  productListing.classList.add('hide');
  cartListing.classList.remove('hide');
});

/*******************************/
/* formerly cart.js code below */
/*******************************/

/* set up listeners for Apply Promo buttons */
for (i=0; i<applyPromoButtonsArray.length; i++) {

}

/* event listener function for keep shopping button press */
function keepShopping(clickEvent) {
  clickEvent.preventDefault();
  cartListing.classList.add('hide');
  productListing.classList.remove('hide');
}
for (i=0; i<keepShoppingButtonsArray.length; i++) {
  keepShoppingButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    cartListing.classList.add('hide');
    productListing.classList.remove('hide');
  });
}

/* cart item action elements */

/* listeners for Update Cart buttons */
for (i=0; i<updateCartButtonsArray.length; i++) {
      /* update cart */
    if (Object.keys(cartItems).length > 0) {
      /* item may already be in cart */
      for (var key in cart) {

      }
    } else {

    }

}

/* listeners for Remove buttons */


/* Show Details/Hide Details for cart items */
for (i=0; i<showDetailsButtonsArray.length; i++) {

  showDetailsButtonsArray[i].addEventListener('click', function(event) {
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