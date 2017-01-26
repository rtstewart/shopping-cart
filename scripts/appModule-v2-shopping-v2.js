/*
  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
  https://developer.mozilla.org/en-US/docs/Web/API/Node
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
  http://www.regular-expressions.info/alternation.html
  maybe use pattern="^(promoCode1text|promoCode2text|promoCode3text)$"
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - not sure about useCapture option for addEventListener;
*/

app.shopping = (function(products, promos, cartItemHtmlText) {

  // var clickEvent;

  /* items previously in supercycles.js below */
  var promosAnchor;

  var modal;
  var modalContainer;
  var modalContent;
  var modalCloseAnchor;
  /* items previously in supercycles.js above */

  var checkDOMLoaded;
  /* cartItems {} will have the following structure:
      {
        sku:quantity,
        .
        .
        .
        sku:quantity
      }
  */
  var cartItems;
  // var cartItemHtmlText;

  /* the main 2 pages to alternately display/hide */
  var productListing;
  var cartListing;

  /* show cart buttons/widgets within Supercycles nav, and .listing-container */
  var showCartButtonInMain;
  var showCartButtonInListing;

  var cartTotalQuantityMain;
  var cartTotalQuantityListing;

  /* cart header and footer, and associated action elements */

  /* NOTE in our "mock" shopping scenario here, these elements already exist in
      the DOM so we can reference them already;
      Normally, they might be created dynamically and would have to be dealt with
      more like the cart items below with regard to event listeners and so forth.
  */
  var cartHeader;
  var cartFooter;

  /* cart summary header/footer elements that will need to be updated */
  var cartQuantitySpanArray;
  var cartSubtotalTdArray;
  var cartPromoCodeSpanArray;
  var cartPromoDiscountTdArray;
  var cartTotalTdArray;

  /* cart summary header/footer elements that will need event listeners */
  var promoCodeInputArray;

  function init() {
    /* Internet Explorer 9, 10 & 11 Event constructor doesn't work:
        http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
        leaving this here FYI;
    */
    // clickEvent = new Event('click');

    /* items previously in supercycles.js below */
    promosAnchor = document.querySelector('aside ul li a:first-child');

    modal = document.querySelector('.modal');
    modalContainer = document.querySelector('.modal-container');
    modalContent = document.querySelector('.modal-content');
    modalCloseAnchor = document.querySelector('.modal-footer a');
    /* items previously in supercycles.js above */

    promos.init();
    products.init();
    cartItems = {};

    /* the main 2 pages to alternately display/hide */
    productListing = document.querySelector('.listing-container');
    cartListing = document.querySelector('.shopping-cart');

    /* show cart buttons/widgets within Supercycles nav, and .listing-container */
    showCartButtonInMain = document.querySelector('nav .show-cart-main');
    showCartButtonInListing = document.querySelector('.listing-container .show-cart-listing');
    /* disable the show cart buttons initially, and when total cart items is zero */
    showCartButtonInMain.disabled = true;
    showCartButtonInListing.disabled = true;

    cartTotalQuantityMain = document.querySelector('div.cart-quantity-all-main');
    cartTotalQuantityListing = document.querySelector('div.cart-quantity-all-listing');

    /* cart header and footer, and associated action elements */

    cartHeader = document.querySelector('#cart-header');
    cartFooter = document.querySelector('#cart-footer');

    /* cart summary header/footer elements that will need to be updated */
    cartQuantitySpanArray = document.querySelectorAll('span.cart-quantity');
    cartSubtotalTdArray = document.querySelectorAll('td.cart-subtotal');
    cartPromoCodeSpanArray = document.querySelectorAll('span.promo-code');
    cartPromoDiscountTdArray = document.querySelectorAll('td.cart-promo-discount');
    cartTotalTdArray = document.querySelectorAll('.shopping-cart td.cart-total');

    /* cart summary header/footer elements that will need event listeners */
    promoCodeInputArray = document.querySelectorAll('.shopping-cart input.promo-code');

    _addListeners();

    /* show the available promos after the page is completely loaded;
        check for completely loaded page every second; */
    checkDOMLoaded = setInterval(function() {
      // console.log(new Date());
      if (document.readyState == 'complete') {
          clearInterval(checkDOMLoaded);
          /* only show promos modal on page load if there are any promos */
          if (Object.keys(promos.getPromoKeys()).length > 0) {
            _clickPromosAlert2();
          }
        }
    }, 500);

  } // end init

  function _clickPromosAlert2(event) {
    /* this function will show a message indicating that there are no promos
      available if the promos object is empty;
      otherwise, it will display the promos available in the .modal-container
      modal if there are any promos in the promos object; */
    /* In order to leave event.preventDefault() in here, not really necessary,
        but for the sake of handling the situation, I chose to leave it;
        I had previously established the 'clickEvent' event, whereby I can
        dispatch a 'click' event and attach the event to the 'promosAnchor'
        to respond with this function, which is the listener function attached
        to the 'promosAnchor' 'click' event;
        However, IE 11 did not support the clickEvent = new Event('click');
        line in init, so I reworked this function to handle the case where an
        event is not passed (undefined) and respond accordingly;
        With event.preventDefault() for an anchor click, this prevents the page
        jump that would occur otherwise unless something like href="#!" is used;
        If an event is not passed, and event.preventDefault() is called, an
        error would occur; */
    if (event) {
      event.preventDefault();
      console.log('event.type:', event.type);
    }
    /* alert a promos message if the promos object is not empty */
    var promoMsg;
    if (Object.keys(promos.getPromoKeys()).length > 0) {
      var promoMsg = '<h4>Promotional Codes</h4>'
                    + '<p>- There are typically several types of promos available on any given day.'
                    + '<br>- Only one promo code can be applied to a purchase.'
                    + '<br>- Of the promo codes you enter, the one giving the greatest discount will be applied.</p>'
                    + '<p>Today\'s promo codes and descriptions are as follows:';
      for (var key in promos.getPromoKeys()) {
        promoMsg += '<br><br><strong>' + promos.getPromo(key).promoCode + "</strong> : " + promos.getPromo(key).description;
      }
      promoMsg += '</p>';
    } else {
        /* only want to show this if "Promos/Promotional Code" anchor was clicked; */
        promoMsg = '<h4>No Promotions Today</h4>'
                    + '<p>Sorry, there are no promotions available today.'
                    + '<br><br>We typically add promotions daily though.'
                    + '<br><br>Please continue shopping at SuperCycles.</p>';
    }
    // alert(promoMsg);
    _showModal(promoMsg);
  } // end _clickPromosAlert2

  /* https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment */
  /* https://developer.mozilla.org/en-US/docs/Web/API/Element */
  function _makeCartItemNode(sku, quantity) {
    // ?? this didn't work
    // var newCartItemNode = document.createDocumentFragment();
    // newCartItemNode.innerHTML = cartItemHtmlText;

    /* this technique works for creating the new node */
    var nodeContainer = document.createElement('div');
    nodeContainer.innerHTML = cartItemHtmlText;
    /* I only really want the results from cartItemHtmlText within nodeContainer. */
    var newCartItemNode = nodeContainer.firstChild;
    // console.log(newCartItemNode);

    /* set the data-sku attribute to the appropriate sku */
    // console.log(newCartItemNode.querySelector('div.item-cart'));
    newCartItemNode.setAttribute('data-sku', sku);
    /* set the value of the input.sku - currently not used */
    newCartItemNode.querySelector('input.sku').setAttribute('value', sku);
    /* set the value for the image URI */
    newCartItemNode.querySelector('img.item-img-cart').setAttribute('src', products.getProduct(sku).imageUri);
    /* set value for item heading/title */
    newCartItemNode.querySelector('div.desc h4').innerHTML = products.getProduct(sku).title;

    newCartItemNode.querySelector('span.sku').innerHTML = sku;

    newCartItemNode.querySelector('div.desc-text').innerHTML = products.getProduct(sku).description;

    if (products.getProduct(sku).salePrice !== '') {
      /* this sku is on sale */
      newCartItemNode.querySelector('div.price').classList.add('sale');
      newCartItemNode.querySelector('span.item-sale-price').innerHTML = products.getProduct(sku).salePrice;
      /* make use of the fact that I did this test and populate item subtotal */
      newCartItemNode.querySelector('div.item-subtotal span').innerHTML = (quantity * parseFloat(products.getProduct(sku).salePrice)).toFixed(2).toString();
    } else {
      /* item not on sale so update subtotal accordingly */
      newCartItemNode.querySelector('div.item-subtotal span').innerHTML = (quantity * parseFloat(products.getProduct(sku).price)).toFixed(2).toString();
    }

    newCartItemNode.querySelector('span.item-regular-price').innerHTML = products.getProduct(sku).price

    newCartItemNode.querySelector('input.quantity').value = quantity;

    newCartItemNode.querySelector('input.quantity').setAttribute('title',
      'Update cart quantity must be '
      + newCartItemNode.querySelector('input.quantity').getAttribute('min')
      + ' to ' + newCartItemNode.querySelector('input.quantity').getAttribute('max'));

    return newCartItemNode;

  } // end _makeCartItemNode

  function _hideListShowCart(event) {
    /* productListing is 'this' in here, since the listener for it
        will call this function;
        for an event listener function, 'this' is always the element
        on which the listener was bound to; */
    if (this.classList.contains('goaway')) {
      // this.style.display = 'none';
      this.classList.remove('show');
      this.classList.add('hide');
      cartListing.classList.remove('goaway');
      // cartListing.style.display = 'block';
      cartListing.classList.remove('hide');
      cartListing.classList.add('show');
      cartListing.classList.add('comeback');
    }
  } // end _hideListShowCart

  function _hideCartShowList(event) {
    /* cartListing is 'this' in here, since the listener for it
        will call this function;
        for an event listener function, 'this' is always the element
        on which the listener was bound to; */
    if (this.classList.contains('goaway')) {
      // this.style.display = 'none';
      this.classList.remove('show');
      this.classList.add('hide');
      productListing.classList.remove('goaway');
      // productListing.style.display = 'block';
      productListing.classList.remove('hide');
      productListing.classList.add('show');
      productListing.classList.add('comeback');
    }
  } // end _hideCartShowList

  function _hideProductListing(event) {
      productListing.classList.remove('comeback');
      productListing.classList.add('goaway');
  } // end _hideProductListing

  function _hideCartListing(event) {
      cartListing.classList.remove('comeback');
      cartListing.classList.add('goaway');
  } // end _hideCartListing

  /* items previously in supercycles.js below */
  function _showModal(alertMsgHtmlText) {
    /* empty contents of .modal-content */
    modalContent.innerHTML = '';
    /* fill .modal-content */
    modalContent.innerHTML = alertMsgHtmlText;

    /* delete "old" top css rule for dynamicCssRule as index 0 of
        supercyclesCss;
        then create new rule based on current scrollY and reinsert at 0; */
    // supercyclesCss.deleteRule(0);
    // dynamicCssRule = '.modal-container {top:' + (scrolledY + 32) + 'px;}';
    // supercyclesCss.insertRule(dynamicCssRule, 0);

    /* show modal */
    modal.classList.remove('invisible');
    modal.classList.add('visible', 'z100');

    /* show modal-container */
    /* first, set top position based on current window.scrollY; */
    /*
      http://www.w3schools.com/jsref/prop_win_pagexoffset.asp
      https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
      "For cross-browser compatibility, use window.pageYOffset instead of window.scrollY."
    */
    // modalContainer.style.top = (window.scrollY + 32) + 'px';
    modalContainer.style.top = (window.pageYOffset + 32) + 'px';
    modalContainer.classList.remove('invisible');
    modalContainer.classList.add('visible', 'z100');
  } // end _showModal

  function _hideModal(event) {
    event.preventDefault();

    modalContainer.classList.remove('visible', 'z100');
    modalContainer.classList.add('invisible');

    modal.classList.remove('visible', 'z99');
    modal.classList.add('invisible');
  } // end _hideModal

  /* items previously in supercycles.js above */

  function _showHide(event) {
    productListing.classList.add('hide');
    cartListing.classList.remove('hide');
  } // end _showHide

  function _addToCartSubmit(event) {
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
    var nodeToInsert = _makeCartItemNode(sku, quantity);
    // console.log('nodeToInsert:', nodeToInsert);

    /* https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore */
    cartListing.insertBefore(nodeToInsert, cartFooter);

    /* update cartItems object with new item addition */
    cartItems[sku] = quantity;

    /* update cart summary header/footer */
    _updateCartSummary();

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

  } // end _addToCartSubmit

  function _updateCartSubmit(event) {
    /* submit event already filters out non-form buttons */
    /* there are submit buttons in the cart header and footer,
        as well as on each cart item's form */
    event.preventDefault();
    /* just as an FYI in here:
        'this' is .shopping-cart;
        'event.target' is the form element associated with the submit event; */
    /* the submit event could only have been triggered by the submit button
        in the form element (event.target), so address that; */

    /* we will only get to execute below, if the form has validated as valid; */

    /* event.target is <form> in here */
    /* see which button was used to submit */
    var submitButton = event.target.querySelector('button');

    if (submitButton.classList.contains('update')) {
      /* here, we know it was an "Update Cart" button */
      /* no custom validation was done for this form */
      _updateCartFromForm(event.target);
    } else if (submitButton.classList.contains('apply-promo')) {
      /* here, we know it was an "Apply Promo" button */
      /* custom validation was done for this form */
      /* prior validation has determined that the trimmed, uppercased-value
          is a valid and currently unused promotional code, so pass the
          trimmed, uppercased-value to _updateCartSummary() */
      _updateCartSummary(event.target.querySelector('input.promo-code').value.trim().toUpperCase());
    } // end if (submitButton.classList.contains('quantity'))

  } // end _updateCartSubmit

  function _cartButtonsClick(event) {
    /* address click event for buttons/elements other than "Update Cart"; */

    /* get the button/element that was clicked */
    var clickedElement = event.target;
    var associatedCartItem = clickedElement.parentElement.parentElement;

    if (clickedElement.classList.contains('apply-promo')) {
      /* we are "intercepting" the Apply promo submission, by listening for the
          'click' event on that element, to do custom validation; */
      var associatedInput = clickedElement.parentElement.querySelector('input.promo-code');
      if (associatedInput.value.trim() == '') {
         associatedInput.setCustomValidity('Please supply a Promo Code to apply.');
      } else if (associatedInput.value.trim().toUpperCase() in promos.getPromoKeys()) {
          /* we have a valid input promo code here; */
          // associatedInput.setCustomValidity('');
          if (promos.getPromo(associatedInput.value.trim().toUpperCase()).isUsed) {
            /* promo code is already being used, so don't submit */
            associatedInput.setCustomValidity(associatedInput.value.trim().toUpperCase() + ' is already being used.');
            setTimeout(_clearInputValue(associatedInput), 1000);
          } else {
              /* we now know we have a valid, currently-unused promo code; */
              /* since clicking the .apply-promo button submits the parent form
                  we setCustomValidity('') so the form validates to valid;
                  we then call _updateCartSummary from the 'submit' event listener
                  so that the cart only gets updated upon submission of a valid and
                  currently-unused promo code */
              associatedInput.setCustomValidity('');
          }
      } else {
          associatedInput.setCustomValidity(associatedInput.value + ' is not a valid Promotional Code.');
          setTimeout(_clickPromosAlert2, 2000);
          // below was just left in for FYI regarding dispatching events;
          // setTimeout((function() {
          //   return function() {
          //     promosAnchor.dispatchEvent(clickEvent);
          //   }
          // })(), 2000);
      }
    } else if (clickedElement.classList.contains('keep-shopping')) {
        // cartListing.classList.add('hide');
        // productListing.classList.remove('hide');
        _hideCartListing();
    } else if (clickedElement.classList.contains('checkout')) {
        _justTesting();
    } else if (clickedElement.classList.contains('remove')) {
        _removeCartItem(associatedCartItem);
    } else if (clickedElement.classList.contains('see-detail')) {
        _showHideItemDetail(clickedElement);
    } else if (clickedElement.innerHTML == 'Promotional Code:') {
        _clickPromosAlert2();
        // promosAnchor.dispatchEvent(clickEvent);
    }

  } // end _cartButtonsClick

  function _showHideItemDetail(clickedButton) {
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
  } // end _showHideItemDetail

  function _updateCartFromForm(theFormElement) {
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
      _removeCartItem(associatedCartItem);
    } else {
        /* update cartItems object with non-zero value */
        cartItems[sku] = associatedQuantityInput.value;
        /* check cart and respond accordingly to total number of items */
        _checkCartItemsQuantity();
        /* set associated listing quantity to the new non-zero value */
        associatedListingQuantityInput.value = cartItems[sku];
        /* update item subtotal in cart item */
        if (products.getProduct(sku).salePrice !== '') {
          /* item is on sale */
          associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products.getProduct(sku).salePrice).toFixed(2).toString();
        } else {
          /* item is not on sale */
          associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products.getProduct(sku).price).toFixed(2).toString();
        }
    } // end if (associatedQuantityInput.value == '0')

    _updateCartSummary();

  } // end _updateCartFromForm

  function _playSound() {
      var snd=document.getElementById('rejoice');
      canPlayMP3 = (typeof snd.canPlayType === "function" && snd.canPlayType("audio/mpeg") !== "");
      snd.src=canPlayMP3?'Hallelujah-Chorus-short.mp3':'Hallelujah-Chorus-short.ogg';
      snd.load();
      snd.play();
  } // end _playSound

  function _justTesting() {
    _playSound();
    _showModal('<h4>Hallelujah!</h4><p>You decided to buy something.<br><br>Just wanted to test your curiosity ;-)</p>');
  } // end _justTesting

  function _checkCartItemsQuantity() {
    /* this will check and update globally available things that
        need to be checked/updated when cartItems changes; */

    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    var discountedItemCode;
    var discountCategory;
    for (var key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }

    /* update .cart-quantity-all in Supercycles, and "widget" in listing */
    cartTotalQuantityMain.innerHTML = cartNumItems.toString();
    cartTotalQuantityListing.innerHTML = cartNumItems.toString();

    if (cartNumItems == 0) {
      /* cart is now empty */

      /* with nothing in cart, if a promo code is set as used, make it unused */
      for (key in promos.getPromoKeys()) {
        if (promos.getPromo(key).isUsed) {
          promos.setPromoIsUsed(key, false);
        }
      }

      /* disable show cart buttons/widgets */
      showCartButtonInMain.disabled = true;
      showCartButtonInListing.disabled = true;

      /* display product listing, and hide cart */
      // productListing.classList.remove('hide');
      // cartListing.classList.add('hide');
      _hideCartListing();
    }

    if (cartNumItems > 0) {
      /* test to see if any currently used promo code exists,
          and if so, see if it now applies to anything in the
          cart now that item(s) have been removed/changed;
      */
      for (key in promos.getPromoKeys()) {
        /* see if anything in cart applies to it */
        if (promos.getPromo(key).isUsed) {
          /* found a promo already being used, so see if it still applies to
              anything in the cart; */

          switch (promos.getPromo(key).byMethod) {
            case 'ITEM':
              discountedItemCode = key.slice(5);
              /* if this specific item (discountedItemCode) does not exist in
                  cart anymore, then set the promo code to unused/false;
              */
              if (!cartItems[discountedItemCode]) {
                promos.setPromoIsUsed(key, false);
              }
              break;
            case 'CART':
              /* if anything is left in cart, as is the case within this 'if'
                  block, this promo code will apply, so don't do anything with
                  its used/unused property;
              */
              break;
            case 'TYPE':
              discountCategory = key.slice(5).toLowerCase();
              /* set to unused, then see if something in cart uses it */
              promos.setPromoIsUsed(key, false);
              for (var prodKey in cartItems) {
                if (discountCategory == products.getProduct(prodKey).category) {
                  promos.setPromoIsUsed(key, true);
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

  } // end _checkCartItemsQuantity

  function _getCartItemsQuantity() {
    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    for (var key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }
    return cartNumItems;
  } // end _getCartItemsQuantity

  function _calcPromoDiscount(promoCode, cartSubtotal) {
    var promoDiscount = 0;
    var discountedItemCode;
    var discountCategory;
    switch (promos.getPromo(promoCode).byMethod) {

      case 'ITEM':
        discountedItemCode = promoCode.slice(5);
        /* only look to apply the discount if the item exists in the car */
        if (cartItems[discountedItemCode]) {

          if (products.getProduct(discountedItemCode).salePrice == '') {
            /* item is NOT also on sale */
            itemPrice = products.getProduct(discountedItemCode).price;
          } else {
            /* item IS also on sale */
            itemPrice = products.getProduct(discountedItemCode).salePrice;
          }
          promoDiscount = cartItems[discountedItemCode] * itemPrice * promos.getPromo(promoCode).percentOff * 0.01;

        } // end if (cartItems[discountedItemCode])
        break;
      case 'CART':
        promoDiscount = cartSubtotal * promos.getPromo(promoCode).percentOff * 0.01;
        break;
      case 'TYPE':
        discountCategory = promoCode.slice(5).toLowerCase();
        for (var prodKey in cartItems) {
          if (discountCategory == products.getProduct(prodKey).category) {
            if (products.getProduct(prodKey).salePrice == '') {
              /* item is NOT also on sale */
              itemPrice = products.getProduct(prodKey).price;
            } else {
                /* item IS also on sale */
                itemPrice = products.getProduct(prodKey).salePrice;
            }
            promoDiscount += cartItems[prodKey] * itemPrice * promos.getPromo(promoCode).percentOff * 0.01;
          }
        }
        break;
      default:
        // don't want to do anything here so we return 0

    } // end switch (promos.getPromo(promoCode).byMethod)

    return promoDiscount;
  } // end _calcPromoDiscount

  function _updateCartSummary(newPromoCode) {
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
      if (products.getProduct(key).salePrice == '') {
        /* this item is not on sale */
        cartSubtotal += cartItems[key] * products.getProduct(key).price;
      } else {
        /* this item is on sale */
        cartSubtotal += cartItems[key] * products.getProduct(key).salePrice;
      }
    } // end for

    /* assign cart total prior to discount calculations */
    cartTotal += cartSubtotal;

    /* calculate discount from existing used promo if any */
    for (key in promos.getPromoKeys()) {

      if (promos.getPromo(key).isUsed) {
        /* found a promo already being used, so calculate the resulting discount */
        existingPromoCode = key;
        existingPromoCodeDiscount = _calcPromoDiscount(existingPromoCode, cartSubtotal);
      } // end if (promos[key].isUsed)

    } // end for (key in promos)

    /* if newPromoCode is not undefined, it was supplied as valid and unused */
    if (newPromoCode) {
      newPromoCodeDiscount = _calcPromoDiscount(newPromoCode, cartSubtotal);
    }

    /* should now have a promoDiscount amount here, if any;
        now, to figure out if we have any or both promos,
        and if so, which to use;
    */
    if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount != 0) {
      if (newPromoCodeDiscount > existingPromoCodeDiscount) {
        /* apply new promo instead of existing */
        promos.setPromoIsUsed(existingPromoCode, false);
        promos.setPromoIsUsed(newPromoCode, true);
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
      promos.setPromoIsUsed(newPromoCode, true);
      appliedPromoCode = newPromoCode;
      appliedPromoCodeDiscount = newPromoCodeDiscount;
    } else if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount == 0) {
      promos.setPromoIsUsed(existingPromoCode, true);
      appliedPromoCode = existingPromoCode;
      appliedPromoCodeDiscount = existingPromoCodeDiscount;
    }

    /* apply promo discount, if any, to cartTotal */
    cartTotal -= appliedPromoCodeDiscount;

    /* correct evaluation of below condition relies on newPromoCodeDiscount
        having a value >= zero, i.e., NOT 'undefined';
    */
    if (newPromoCode && newPromoCodeDiscount == 0) {
      _showModal('<p>Sorry, <strong>' + newPromoCode + '</strong> is a valid promo code, but no discount could be applied with it.</p>')
    }

    if (newPromoCode && newPromoCodeDiscount > 0 && newPromoCodeDiscount <= existingPromoCodeDiscount) {
      _showModal('<p>Sorry, no greater discount could be applied for promo code: ' + newPromoCode
            + '<br><br>' + existingPromoCode + ' discount is $' + existingPromoCodeDiscount.toFixed(2)
            + '<br><br>' + newPromoCode + ' discount would be $' + newPromoCodeDiscount.toFixed(2) + '</p>');
    }

    /* update cart summary fields */
    numCartItems = _getCartItemsQuantity();
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
      setTimeout(_clearInputValue(promoCodeInputArray[i]), 250);
      // promoCodeInputArray[i].value = '';
      // console.log('promoCodeInputArray[' + i + '].value =', promoCodeInputArray[i].value);

    } // end for

  } // end _updateCartSummary

  function _clearInputValue(inputElement) {
    return  function() {
              inputElement.value = '';
            };
  } // end _clearInputValue

  function _removeCartItem(cartItem) {

    var sku = cartItem.dataset.sku;
    var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
    var associatedListingItemQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');
    var associatedListingItemAddToCartButton = associatedListingItem.querySelector('button.add-to-cart');

    delete cartItems[sku];

    /* check cart and respond accordingly to total number of items,
        and also type of item(s) with regard to promo code; */
    _checkCartItemsQuantity();

    /* update cart summary - must be left after _checkCartItemsQuantity(); */
    _updateCartSummary();

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

  } // end function _removeCartItem

  function _addListeners() {

    /* the following four listeners are for showing/hiding listing and cart
        with animation
        I chose to use them instead of the previous 2 (commented out below)
        so as to have a more gentle transition; */
    productListing.addEventListener('animationend', _hideListShowCart, false);
    cartListing.addEventListener('animationend', _hideCartShowList, false);
    /* set up event listeners for show cart buttons/widgets */
    showCartButtonInMain.addEventListener('click', _hideProductListing, false);
    showCartButtonInListing.addEventListener('click', _hideProductListing, false);

    // showCartButtonInMain.addEventListener('click', _showHide);
    /* this DOM element might normally be created dynamically when the listing
        page gets populated dynamically;
        in our case, it exists on initial page load, so we can reference it;
    */
    // showCartButtonInListing.addEventListener('click', _showHide);

    /* items previously in supercycles.js below */
    modalCloseAnchor.addEventListener('click', _hideModal);
    promosAnchor.addEventListener('click', _clickPromosAlert2);
    /* items previously in supercycles.js above */

    /* listen for submit and click events in .listing-container */
    productListing.addEventListener('submit', _addToCartSubmit);

    productListing.addEventListener('click', function(event) {
      /* want to ignore clicking on "Add to cart" button which
          we should respond to with the submit event being triggered; */
      /* conversely, we want to ONLY respond to some other button if
          it exists, such as if I add a "Show Details/Hide Details"
          button; */
        /* get the button/element that was clicked */
    }); // end productListing.addEventListener('click', ...)

    cartListing.addEventListener('submit', _updateCartSubmit);

    cartListing.addEventListener('click', _cartButtonsClick);

  } // end _addListeners

  return {
    init: init
  };


})(app.products, app.promos, app.cartItemHtmlText); // end app.shopping = (function() {