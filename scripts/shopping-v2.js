/*
  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
  https://developer.mozilla.org/en-US/docs/Web/API/Node
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
  http://www.regular-expressions.info/alternation.html
  maybe use pattern="^(promoCode1text|promoCode2text|promoCode3text)$"
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - not sure about useCapture option for addEventListener;
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
var cartHeader = document.querySelector('#cart-header');
var cartFooter = document.querySelector('#cart-footer');

/* cart summary header/footer elements that will need to be updated */
var cartQuantitySpanArray = document.querySelectorAll('span.cart-quantity');
var cartSubtotalTdArray = document.querySelectorAll('td.cart-subtotal');
var cartPromoCodeSpanArray = document.querySelectorAll('span.promo-code');
var cartPromoDiscountTdArray = document.querySelectorAll('td.cart-promo-discount');
var cartTotalTdArray = document.querySelectorAll('.shopping-cart td.cart-total');

/* cart summary header/footer elements that will need event listeners */
var promoCodeInputArray = document.querySelectorAll('.shopping-cart input.promo-code');

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

/* listen for submit and click events in .listing-container */
productListing.addEventListener('submit', function(event) {
  /* this will capture the attempted submission of an
      "Add to cart" value via clicking on that button, which
      is the submit button for the parent form element; */
  event.preventDefault();

  /* the following will only get executed upon a valid submission of quantity */
  /* get the sku associated with the particular "Add to cart" button clicked; */
  /* just as an FYI in here:
      'this' is .listing-container;
      'event.target' is the form element associated with the submit event; */
  var sku = event.target.parentElement.parentElement.dataset.sku;

  var associatedQuantityInput = event.target.querySelector('.quantity');
  /* NOTE: quantity could include a leading + in value; */
  var quantity = associatedQuantityInput.value;
  var associatedAddToCartButton = event.target.querySelector('.add-to-cart');
  /* in case there is a leading + in value, this will get rid of it; */
  quantity = parseInt(associatedQuantityInput.value);
  associatedQuantityInput.value = '';
  associatedQuantityInput.value = quantity;

  /* change text on Add to Cart button, and disable it and the associated input */
  associatedAddToCartButton.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Item in cart';
  /* disable button and input */
  associatedQuantityInput.disabled = true;
  associatedAddToCartButton.disabled = true;

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

  /* update .cart-quantity-all in Supercycles, and "widget" in listing */
  cartTotalQuantityMain.innerHTML = cartNumItems.toString();
  cartTotalQuantityListing.innerHTML = cartNumItems.toString();

  /* enable show cart buttons/widgets */
  showCartButtonInMain.disabled = false;
  showCartButtonInListing.disabled = false;

}); // end productListing.addEventListener('submit', ...)

productListing.addEventListener('click', function(event) {
  /* want to ignore clicking on "Add to cart" button which
      we should respond to with the submit event being triggered; */
  /* conversely, we want to ONLY respond to some other button if
      it exists, such as if I add a "Show Details/Hide Details"
      button; */
    /* get the button/element that was clicked */
}); // end productListing.addEventListener('click', ...)

cartListing.addEventListener('submit', function(event) {
  /* submit event already filters out non-form buttons */
  /* there are submit buttons in the cart header and footer,
      as well as on each cart item's form */
  event.preventDefault();
  /* just as an FYI in here:
      'this' is .shopping-cart;
      'event.target' is the form element associated with the submit event; */
  /* the submit event could only have been triggered by the submit button
      in the form element (event.target), so address that; */

  /* see which button was used to submit */
  var submitButton = event.target.querySelector('button');

  if (submitButton.classList.contains('update')) {
    /* now we know it was an "Update Cart" button */
    /* event.target is <form> */
    updateCartFromForm(event.target);
  } else if (submitButton.classList.contains('apply-promo')) {
    // applyPromoCode(submitButton);
  } // end if (submitButton.classList.contains('quantity'))

}); // end cartListing.addEventListener('submit',...)

cartListing.addEventListener('click', function(event) {
  /* address click event for buttons/elements other than "Update Cart"; */

  /* get the button/element that was clicked */
  var clickedElement = event.target;
  var associatedCartItem = clickedElement.parentElement.parentElement;

  if (clickedElement.classList.contains('apply-promo')) {
    var associatedInput = clickedElement.parentElement.querySelector('input.promo-code');
    if (associatedInput.value.trim() == '') {
       associatedInput.setCustomValidity('Please supply a Promo Code to apply.');
    } else if (associatedInput.value.trim().toUpperCase() in promos) {
        /* we have a valid input promo code here; */
        associatedInput.setCustomValidity('');
        if (promos[associatedInput.value.trim().toUpperCase()].isUsed) {
          /* promo code is already being used, so don't submit */
          associatedInput.setCustomValidity(associatedInput.value.trim().toUpperCase() + ' is already being used.');
          setTimeout(clearInputValue(associatedInput), 1000);
        } else {
            /* update cart summary using the valid, unused promo code */
            updateCartSummary(associatedInput.value.trim().toUpperCase());
            // setTimeout(function() {associatedInput.value = '';}, 2000);
        }
    } else {
        associatedInput.setCustomValidity(associatedInput.value + ' is not a valid Promotional Code.');
        setTimeout(clickPromosAlert, 4000);
    }
  } else if (clickedElement.classList.contains('keep-shopping')) {
      cartListing.classList.add('hide');
      productListing.classList.remove('hide');
  } else if (clickedElement.classList.contains('checkout')) {
      justTesting();
  } else if (clickedElement.classList.contains('remove')) {
      removeCartItem(associatedCartItem);
  } else if (clickedElement.classList.contains('see-detail')) {
      showHideItemDetail(clickedElement);
  } else if (clickedElement.innerHTML == 'Promotional Code:') {
      clickPromosAlert();
  }

}); // end cartListing.addEventListener('click', ...)

function showHideItemDetail(clickedButton) {
  /* get the sku data for this .item-cart */
  var sku = clickedButton.parentElement.parentElement.dataset.sku;
  var descriptiveTextDiv = document.querySelector('.item-cart[data-sku="' + sku + '"] .desc-text');
  // console.log(this.parentElement.parentElement.dataset.sku);

  if (clickedButton.innerHTML == 'Show Details') {
    descriptiveTextDiv.classList.remove('hide');
    descriptiveTextDiv.classList.add('show');
    clickedButton.innerHTML = 'Hide Details';
  } else {
    descriptiveTextDiv.classList.remove('show');
    descriptiveTextDiv.classList.add('hide');
    clickedButton.innerHTML = 'Show Details';
  }
} // end function showHideItemDetail


function updateCartFromForm(theFormElement) {
  /* event.target is <form> */
  var associatedQuantityInput = theFormElement.parentElement.querySelector('input.quantity');
  /* NOTE: updateQuantity could include a leading + in value; */
  var updateQuantity = associatedQuantityInput.value;

  var associatedCartItem =  theFormElement.parentElement.parentElement;
  var sku = associatedCartItem.dataset.sku;
  var associatedCartItemSubtotalSpan = associatedCartItem.querySelector('div.item-subtotal span');

  var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
  var associatedListingQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');

  /* in case there is a leading + in value, this will get rid of it; */
  updateQuantity = parseInt(associatedQuantityInput.value);
  associatedQuantityInput.value = '';
  associatedQuantityInput.value = updateQuantity;

  /* update associated listing item quantity and Add to cart button */
  if (updateQuantity == 0) {
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

} // end function updateCartFromForm

function justTesting() {
  playSound();
  showModal('<h4>Hallelujah!</h4><p>You decided to buy something.<br><br>Just wanted to test your curiosity ;-)</p>');
} // end function justTesting

function checkCartItemsQuantity() {
  /* this will check and update globally available things that
      need to be checked/updated when cartItems changes; */

  /* get total number of items in cartItems object */
  var cartNumItems = 0;
  for (var key in cartItems) {
    cartNumItems += parseInt(cartItems[key]);
  }

  /* update .cart-quantity-all in Supercycles, and "widget" in listing */
  cartTotalQuantityMain.innerHTML = cartNumItems.toString();
  cartTotalQuantityListing.innerHTML = cartNumItems.toString();

  if (cartNumItems == 0) {
    /* cart is now empty */

    /* with nothing in cart, if a promo code is set as used, make it unused */
    for (key in promos) {
      if (promos[key].isUsed) {
        promos[key].isUsed = false;
      }
    }

    /* disable show cart buttons/widgets */
    showCartButtonInMain.disabled = true;
    showCartButtonInListing.disabled = true;

    /* display product listing, and hide cart */
    productListing.classList.remove('hide');
    cartListing.classList.add('hide');
  }

  if (cartNumItems > 0) {
    /* test to see if any currently used promo code exists,
        and if so, see if it now applies to anything in the
        cart now that item(s) have been removed/changed;
    */
    for (key in promos) {
      /* see if anything in cart applies to it */
      if (promos[key].isUsed) {
        /* found a promo already being used, so calculate the resulting discount */

        switch (promos[key].byMethod) {
          case 'ITEM':
            var discountedItemCode = key.slice(5);
            /* if this specific item (discountedItemCode) does not exist in
                cart anymore, then set the promo code to unused/false;
            */
            if (!cartItems[discountedItemCode]) {
              promos[key].isUsed = false;
            }
            break;
          case 'CART':
            /* if anything is left in cart, this promo code will apply,
                so don't do anything with its used/unused property;
            */
            break;
          case 'TYPE':
            var discountCategory = key.slice(5).toLowerCase();
            /* set to unused, then see if something in cart uses it */
            promos[key].isUsed = false;
            for (var prodKey in cartItems) {
              if (discountCategory == products[prodKey].category) {
                promos[key].isUsed = true;
              }
            }
            break;
          default:
            // alert('Something went wrong with EXISTING promo discount calculation.');
        } // end switch (promos[key].byMethod)

      } // end if (promos[key].isUsed)

    } // end for (var key in promos)

  } // end if (cartNumItems > 0)

  /* just in case I want to retrieve the numerical result */
  return cartNumItems;

} // end function checkCartItemsQuantity

function getCartItemsQuantity() {
  /* get total number of items in cartItems object */
  var cartNumItems = 0;
  for (var key in cartItems) {
    cartNumItems += parseInt(cartItems[key]);
  }
  return cartNumItems;
} // end function getCartItemsQuantity

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
      } // end switch (promos[key].byMethod)

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
    } // end switch (promos[key].byMethod)
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

  /* apply promo discount, if any, to cartTotal */
  cartTotal -= appliedPromoCodeDiscount;

  /* correct evaluation of below condition relies on newPromoCodeDiscount
      to be initialized to zero in var declaration;
  */
  if (newPromoCode && newPromoCodeDiscount == 0) {
    showModal('<p>Sorry, <strong>' + newPromoCode + '</strong> is a valid promo code, but no discount could be applied with it.</p>')
  }

  if (newPromoCode && newPromoCodeDiscount > 0 && newPromoCodeDiscount <= existingPromoCodeDiscount) {
    showModal('<p>Sorry, no greater discount could be applied for promo code: ' + newPromoCode
          + '<br><br>' + existingPromoCode + ' discount is $' + existingPromoCodeDiscount.toFixed(2)
          + '<br><br>' + newPromoCode + ' discount would be $' + newPromoCodeDiscount.toFixed(2) + '</p>');
  }

  /* update cart summary fields */
  numCartItems = getCartItemsQuantity();
  for (var i=0; i<cartQuantitySpanArray.length; i++) {
    /* since we have the same number of all elements in cart summary to be
        updated, we will just use the length of cartQuantitySpanArray as
        the reference limit value for the loop;
    */
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
    /* NOTE: without using the slight delay to clear out the input field,
        a validation message would come up indicating that the field was empty;
        I assume this happened because the field was still in the 'submit' state
        since the delay remedied it; */
    setTimeout(clearInputValue(promoCodeInputArray[i]), 250);
    // promoCodeInputArray[i].value = '';
    // console.log('promoCodeInputArray[' + i + '].value =', promoCodeInputArray[i].value);

  } // end for

} // end function updateCartSummary

function clearInputValue(inputElement) {
  return  function() {
            inputElement.value = '';
          };
} // end function clearInputValue

function removeCartItem(cartItem) {

  var sku = cartItem.dataset.sku;
  var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
  var associatedListingItemQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');
  var associatedListingItemAddToCartButton = associatedListingItem.querySelector('button.add-to-cart');

  delete cartItems[sku];

  /* check cart and respond accordingly to total number of items,
      and also type of item(s) with regard to promo code; */
  checkCartItemsQuantity();

  /* update cart summary - must be left after checkCartItemsQuantity(); */
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

} // end function removeCartItem