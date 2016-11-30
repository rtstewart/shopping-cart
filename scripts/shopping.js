/*
  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
  https://developer.mozilla.org/en-US/docs/Web/API/Node
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
*/

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

/* cart header and footer, and associated action elements */

/* NOTE in our "mock" shopping scenario here, these elements already exist in
    the DOM so we can reference them already;
    Normally, they might be created dynamically and would have to be dealt with
    more like the cart items below with regard to event listeners and so forth.
*/
var cartHeader = document.querySelector('div.cart-header');
var cartFooter = document.querySelector('div.cart-footer');

/* cart summary header/footer elements that will need to be updated */
var cartQuantitySpanArray = document.querySelectorAll('span.cart-quantity');
var cartSubtotalTdArray = document.querySelectorAll('td.cart-subtotal');
var cartPromoCodeSpanArray = document.querySelectorAll('span.promo-code');
var cartPromoDiscountTdArray = document.querySelectorAll('td.cart-promo-discount');
var cartTotalTdArray = document.querySelectorAll('.shopping-cart td.cart-total');

/* cart summary header/footer elements that will need event listeners */
var promoCodeAnchorArray = document.querySelectorAll('.shopping-cart .cart-header-footer form label a');
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

function checkCartItemsQuantity() {
  /* this will check and update globally available things */

  /* get total number of items in cartItems object */
  var cartNumItems = 0;
  for (var key in cartItems) {
    cartNumItems += parseInt(cartItems[key]);
  }

  /* update .cart-quantity-all in Supercycles, and widget in listing */
  cartTotalQuantityMain.innerHTML = cartNumItems.toString();
  cartTotalQuantityListing.innerHTML = cartNumItems.toString();

  if (cartNumItems == 0) {
    /* cart is now empty */

    /* disable show cart buttons/widgets */
    showCartButtonInMain.disabled = true;
    showCartButtonInListing.disabled = true;

    /* display product listing, and hide cart */
    productListing.classList.remove('hide');
    cartListing.classList.add('hide');
  }

  return cartNumItems;

} // end function checkCartItemsQuantity()

function getCartItemsQuantity() {
  /* get total number of items in cartItems object */
  var cartNumItems = 0;
  for (var key in cartItems) {
    cartNumItems += parseInt(cartItems[key]);
  }
  return cartNumItems;
}

function updateCartSummary(newPromoCode) {
  /* newPromoCode only gets sent in when it is valid, and currently not used;
      it is not sent in when an item is added to the cart and this function
      gets called;
      so, newPromoCode could be undefined;
  */
  var cartSubtotal = 0;
  var existingPromoCode;
  var existingPromoCodeDiscount = 0;
  var newPromoCodeDiscount = 0;
  var appliedPromoCode;
  var appliedPromoCodeDiscount;
  var numCartItems;
  var cartTotal = 0;
  var discountedItemCode;
  var itemPrice;
  var discountCategory;
  for (var key in cartItems) {
    if (products[key].salePrice == '') {
      /* this item is not on sale */
      cartSubtotal += cartItems[key] * products[key].price;
    } else {
      /* this item is on sale */
      cartSubtotal += cartItems[key] * products[key].salePrice;
    }
  } // end for

  /* assign cart total prior to discount calculations */
  cartTotal += cartSubtotal;

  /* calculate discount from existing used promo if any */
  for (key in promos) {

    if (promos[key].isUsed) {
      /* found a promo already being used, so calculate the resulting discount */
      existingPromoCode = key;

      switch (promos[key].byMethod) {
        case 'ITEM':
          discountedItemCode = key.slice(5);
          /* only look to apply the discount if the item exists in the car */
          if (cartItems[discountedItemCode]) {
            if (products[discountedItemCode].salePrice == '') {
              /* item is NOT also on sale */
              itemPrice = products[discountedItemCode].price;
            } else {
              /* item IS also on sale */
              itemPrice = products[discountedItemCode].salePrice;
            }
            existingPromoCodeDiscount = cartItems[discountedItemCode] * itemPrice * promos[key].percentOff * 0.01;
          }
          break;
        case 'CART':
          existingPromoCodeDiscount = cartSubtotal * promos[key].percentOff * 0.01;
          break;
        case 'TYPE':
          discountCategory = key.slice(5).toLowerCase();
          for (var prodKey in cartItems) {
            if (discountCategory == products[prodKey].category) {
              if (products[prodKey].salePrice == '') {
                /* item is NOT also on sale */
                itemPrice = products[prodKey].price;
              } else {
                  /* item IS also on sale */
                  itemPrice = products[prodKey].salePrice;
              }
              existingPromoCodeDiscount += cartItems[prodKey] * itemPrice * promos[key].percentOff * 0.01;
            }
          }
          break;
        default:
          // alert('Something went wrong with EXISTING promo discount calculation.');
      } // end switch (promos[key].type)

    } // end if (promos[key].isUsed)

  } // end for (key in promos)

  /* if newPromoCode is not undefined, it was supplied as valid and unused */
  if (newPromoCode) {
    switch (promos[newPromoCode].byMethod) {

      case 'ITEM':
        discountedItemCode = newPromoCode.slice(5);
        /* only look to apply the discount if the item exists in the car */
        if (cartItems[discountedItemCode]) {

          if (products[discountedItemCode].salePrice == '') {
            /* item is NOT also on sale */
            itemPrice = products[discountedItemCode].price;
          } else {
            /* item IS also on sale */
            itemPrice = products[discountedItemCode].salePrice;
          }
          newPromoCodeDiscount = cartItems[discountedItemCode] * itemPrice * promos[newPromoCode].percentOff * 0.01;

        } // end if (cartItems[discountedItemCode])
        break;
      case 'CART':
        newPromoCodeDiscount = cartSubtotal * promos[newPromoCode].percentOff * 0.01;
        break;
      case 'TYPE':
        discountCategory = newPromoCode.slice(5).toLowerCase();
        for (prodKey in cartItems) {
          if (discountCategory == products[prodKey].category) {
            if (products[prodKey].salePrice == '') {
              /* item is NOT also on sale */
              itemPrice = products[prodKey].price;
            } else {
                /* item IS also on sale */
                itemPrice = products[prodKey].salePrice;
            }
            newPromoCodeDiscount += cartItems[prodKey] * itemPrice * promos[newPromoCode].percentOff * 0.01;
          }
        }
        break;
      default:
        // alert('Something went wrong with NEW promo discount calculation.');
    } // end switch (promos[key].type)
  }

  /* should now have a promoDiscount amount here, if any;
      now, to figure out if we have any or both promos,
      and if so, which to use;
  */
  if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount != 0) {
    if (newPromoCodeDiscount > existingPromoCodeDiscount) {
      /* apply new promo instead of existing */
      promos[existingPromoCode].isUsed = false;
      promos[newPromoCode].isUsed = true;
      appliedPromoCode = newPromoCode;
      appliedPromoCodeDiscount = newPromoCodeDiscount;
    } else {
      /* existing promo stays in effect */
      appliedPromoCode = existingPromoCode;
      appliedPromoCodeDiscount = existingPromoCodeDiscount;
    }
  } else if (existingPromoCodeDiscount == 0 && newPromoCodeDiscount == 0) {
    /* no promo is applied */
    appliedPromoCode = '';
    appliedPromoCodeDiscount = 0;

  } else if (existingPromoCodeDiscount == 0 && newPromoCodeDiscount != 0) {
    promos[newPromoCode].isUsed = true;
    appliedPromoCode = newPromoCode;
    appliedPromoCodeDiscount = newPromoCodeDiscount;
  } else if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount == 0) {
    promos[existingPromoCode].isUsed = true;
    appliedPromoCode = existingPromoCode;
    appliedPromoCodeDiscount = existingPromoCodeDiscount;
  }

  cartTotal -= appliedPromoCodeDiscount;

  /* update cart summary fields */
  for (i=0; i<cartQuantitySpanArray.length; i++) {
    /* since we have the same number of all elements in cart summary to be
        updated, we will just use the length of cartQuantitySpanArray as
        the reference limit value for the loop;
    */

    numCartItems = getCartItemsQuantity();
    if (numCartItems == 1) {
      cartQuantitySpanArray[i].innerHTML = numCartItems + ' item';
    } else {
      cartQuantitySpanArray[i].innerHTML = numCartItems + ' items';
    }

    cartSubtotalTdArray[i].innerHTML = '$' + cartSubtotal.toFixed(2);

    cartPromoCodeSpanArray[i].innerHTML = appliedPromoCode;

    cartPromoDiscountTdArray[i].innerHTML = '-$' + appliedPromoCodeDiscount.toFixed(2);

    cartTotalTdArray[i].innerHTML = '$' + cartTotal.toFixed(2);

    /* clear out promo code input field */
    promoCodeInputArray[i].value = '';

  } // end for

} // end function updateCartSummary()

function removeCartItem(cartItem) {

  var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
  var associatedListingItemQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');
  var associatedListingItemAddToCartButton = associatedListingItem.querySelector('button.add-to-cart');

  var sku = cartItem.dataset.sku;
  delete cartItems[sku];

  /* check cart and respond accordingly to total number of items */
  checkCartItemsQuantity();

  /* update cart summary */
  updateCartSummary();

  /* reset the listing for this item with regard to:
      Quantity input value reset to 1,
      Quantity input enabled,
      "Item in cart" button text reset to "Add to cart",
      Add to cart button enabled
  */
  associatedListingItemQuantityInput.value = '1';
  associatedListingItemQuantityInput.disabled = false;

  associatedListingItemAddToCartButton.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Add to cart';
  associatedListingItemAddToCartButton.disabled = false;

  /* remove the cart item from the DOM */
  cartItem.parentElement.removeChild(cartItem);

} // end function removeCartItem()

function resetListingQtyAndButton(listingItem) {

}

/***********************************/
/* above - cart-specific variables */
/***********************************/

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

    /* update cart summary header/footer */
    updateCartSummary();

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

    /* Update Cart button event listener and routine for this cart item */
    var updateCartButton = document.querySelector('.shopping-cart div[data-sku="' + sku + '"] .action-cart button.update');
    updateCartButton.addEventListener('click', function(event) {

      var associatedQuantityInput = this.parentElement.querySelector('input.quantity');
      var associatedCartItem =  this.parentElement.parentElement.parentElement;
      var sku = associatedCartItem.dataset.sku;
      var associatedCartItemSubtotalSpan = associatedCartItem.querySelector('div.item-subtotal span');

      var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
      var associatedListingQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');

      /* update associated listing item quantity and Add to cart button */
      if (associatedQuantityInput.value == '0') {
        removeCartItem(associatedCartItem);
      } else {
          /* update cartItems object with non-zero value */
          cartItems[sku] = associatedQuantityInput.value;
          /* check cart and respond accordingly to total number of items */
          checkCartItemsQuantity();
          /* set associated listing quantity to the new non-zero value */
          associatedListingQuantityInput.value = cartItems[sku];
          /* update item subtotal in cart item */
          if (products[sku].salePrice !== '') {
            /* item is on sale */
            associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products[sku].salePrice).toFixed(2).toString();
          } else {
            /* item is not on sale */
            associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products[sku].price).toFixed(2).toString();
          }
      } // end if (associatedQuantityInput.value == '0')

      updateCartSummary();

    }); /* END Update Cart button event listener and routine for this cart item */

    /* Remove item button event listener and routine for this cart item */
    var removeItemButton = document.querySelector('.shopping-cart div[data-sku="' + sku + '"] .action-cart button.remove');

    removeItemButton.addEventListener('click', function(event) {
      event.preventDefault();

      var associatedCartItem =  this.parentElement.parentElement;
      console.log('associatedCartItem:', associatedCartItem);

      var sku = associatedCartItem.dataset.sku;
      delete cartItems[sku];

      /* check cart and respond accordingly to total number of items */
      checkCartItemsQuantity();

      updateCartSummary();

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

    }); /* END Remove item button event listener and routine for this cart item */

    /* Show Details button event listener and routine for this cart item */
    var showDetailsButton = document.querySelector('.shopping-cart div[data-sku="' + sku + '"] .action-cart button.see-detail');
    showDetailsButton.addEventListener('click', function(event) {
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
    }); /* END Show Details button event listener and routine for this cart item */

    console.log('Adding:', quantity, ' of ', sku);
  })
} // end for

/* this will be called by the listener for the Add to cart button of a particular item */
function addItemToCartObj(sku, quantity) {

}

function removeItemFromCartObj(sku) {

}

function removeItemButtonAddEventListener(theButton) {

  theButton.addEventListener('click', function(event) {
      event.preventDefault();

      var associatedCartItem =  this.parentElement.parentElement;

      var sku = associatedCartItem.dataset.sku;
      delete cartItems[sku];

      /* check cart and respond accordingly to total number of items */
      checkCartItemsQuantity();

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

}

// function showPromosAlert() {
//   /* alert a promos message if the promos object is not empty */
//   if (Object.keys(promos).length > 0) {
//     var promoMsg = 'Today\'s promo codes and descriptions are as follows:';
//     for (var key in promos) {
//       promoMsg += '\n\n' + promos[key].promoCode + " : " + promos[key].description;
//     }
//     alert(promoMsg);
//   }
// }

/* set up event listeners for show cart buttons/widgets */
showCartButtonInMain.addEventListener('click', function(event) {
  productListing.classList.add('hide');
  cartListing.classList.remove('hide');
  /* alert a promos message if the promos object is not empty */
  // showPromosAlert();
});
/* this DOM element would normally be created dynamically when the listing
    page gets populated dynamically;
    in our case, it exists on initial page load, so we can reference it;
*/
showCartButtonInListing.addEventListener('click', function(event) {
  productListing.classList.add('hide');
  cartListing.classList.remove('hide');
  /* alert a promos message if the promos object is not empty */
  // showPromosAlert();
});

/*******************************/
/* formerly cart.js code below */
/*******************************/

/* set up event listeners for Promotional Code anchors */
for (i=0; i<promoCodeAnchorArray.length; i++) {
  promoCodeAnchorArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    clickPromosAlert();
  })
}

/* set up listeners for Apply Promo buttons */
for (i=0; i<applyPromoButtonsArray.length; i++) {
  applyPromoButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Apply Promo clicked!');
    applyPromoCode(this);
  });
}

function applyPromoCode(whichButton) {
  /* doesn't matter which button was clicked (in header or footer), the same
      action needs to occur, however, we'll need to grab the value of the
      specific input field associated with the particular button pressed;
  */
  var associatedPromoInput = whichButton.parentElement.querySelector('input.promo-code');
  // console.log('whichButton:', whichButton, '\nassociatedPromoInput:', associatedPromoInput);
  var inputPromoCode = '';

  /* check if code is valid */
  for (key in promos) {
    /* upper case input value since all promos with alpha are upper case */
    if (key == associatedPromoInput.value.toUpperCase()) {
      /* found a valid promo code in promos corresponding to user input value */
      inputPromoCode = associatedPromoInput.value.toUpperCase();
    }
  }
  if (inputPromoCode == '') {
    alert(associatedPromoInput.value + ' is not a valid Promotional Code');
    /* alert available promos, if any */
    clickPromosAlert();
    return;
  }
  /* if here, have a valid promotional code - inputPromoCode */
  /* see if it's already being used */
  if (promos[inputPromoCode].isUsed) {
    alert('Promotional Code ' + inputPromoCode + ' is already being used.');
    return;
  }
  /* now, we have a valid, currently unused, promo code;
      we only allow the use of one at a time, but compare the cart total
      when attempting to use a different one and accept if the cart total
      will be less with the "new" promo;
  */
  updateCartSummary(inputPromoCode);

} // end function applyPromoCode(whichButton)

/* event listener function for keep shopping button press */
// function keepShopping(clickEvent) {
//   clickEvent.preventDefault();
//   cartListing.classList.add('hide');
//   productListing.classList.remove('hide');
// }
for (i=0; i<keepShoppingButtonsArray.length; i++) {
  keepShoppingButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    cartListing.classList.add('hide');
    productListing.classList.remove('hide');
  });
}

/* cart item action elements */

/* listeners for Remove buttons */


/* Show Details/Hide Details for cart items */
// for (i=0; i<showDetailsButtonsArray.length; i++) {

//   showDetailsButtonsArray[i].addEventListener('click', function(event) {
//     event.preventDefault();
//     /* get the sku data for this .item-cart */
//     var sku = this.parentElement.parentElement.dataset.sku;
//     var descriptiveTextDiv = document.querySelector('.item-cart[data-sku="' + sku + '"] .desc-text');
//     console.log(this.parentElement.parentElement.dataset.sku);

//     if (this.innerHTML == 'Show Details') {
//       descriptiveTextDiv.classList.remove('hide');
//       descriptiveTextDiv.classList.add('show');
//       this.innerHTML = 'Hide Details';
//     } else {
//       descriptiveTextDiv.classList.remove('show');
//       descriptiveTextDiv.classList.add('hide');
//       this.innerHTML = 'Show Details';
//     }

//   });

// } // end for (var i=0; i<seeDetailsButtonsArray.length; i++)

