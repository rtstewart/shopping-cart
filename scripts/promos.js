/* always create an empty promo object, even if not to be populated,
    since it will be referenced;
*/
var promos = {};

/*
  promoCode: string; the code which the user will need to type in to get the
  promotional discount

  byMethod: string; indicates how the discount is to be applied;
  allowable values are:
  - "ITEM" (discount is applied to a specific item and the promoCode will have
    the exact format of ITEM-sku);
  - "TYPE" (discount will apply to all items of a specific type/category);
  - "CART" (the discount will apply to the total order)

  percentOff: string; self-explanatory, but use the decimal format as string,
  i.e., 0.15 is 15% discount
*/

/*
  Promo Code use rules:

  - Only apply 1 promo code at a time;

  - Only apply a promo code if it makes the total price less than the total price with the current promo code;
*/

function Promo(promoCode, byMethod, description, percentOff) {
  this.promoCode = promoCode;
  this.byMethod = byMethod;
  this.description = description;
  this.percentOff = percentOff;
  this.isUsed = false;
};

function addPromo(promoCode, byMethod, description, percentOff) {
  promos[promoCode] = new Promo(promoCode, byMethod, description, percentOff);
};

/* NOTE: use all upper case for alpha characters in promo codes as this will
    be an assumption when checking for valid promo codes;
*/

addPromo(
  'ITEM-CA-SR-0716'
  , 'ITEM'
  , 'This promo code will take 10% off of item CA-SR-0716.'
  , '10'
);

addPromo(
  'CART-JASMINE'
  , 'CART'
  , 'This promo code will take 5% off of the entire shopping cart subtotal.'
  , '5'
);

addPromo(
  'TYPE-MERCHANDISE'
  , 'TYPE'
  , 'This promo code will take 7% off of all items in the "merchandise" category.'
    + '<br>Such items have an item code of the form xx-MD-xxxx, where the "MD" indicates merchandise.'
    + '<br>You can search for such items by category as well using "merchandise" as a filter.'
  , '7'
);

function showPromosAlert() {
  /* alert a promos message if the promos object is not empty */
  var promoMsg;
  if (Object.keys(promos).length > 0) {
    // var promoMsg = 'There are typically several types of promos available on any given day.'
    //               +'\nOnly one promo code can be applied to a purchase.'
    //               +'\nOf the promo codes you enter, the one giving the greatest discount will be applied.'
    //               +'\n\nToday\'s promo codes and descriptions are as follows:';
    var promoMsg = '<h4>Promotional Codes</h4>'
                  + '<p>- There are typically several types of promos available on any given day.'
                  + '<br>- Only one promo code can be applied to a purchase.'
                  + '<br>- Of the promo codes you enter, the one giving the greatest discount will be applied.</p>'
                  + '<p>Today\'s promo codes and descriptions are as follows:';
    for (var key in promos) {
      // promoMsg += '\n\n' + promos[key].promoCode + " : " + promos[key].description;
      promoMsg += '<br><br><strong>' + promos[key].promoCode + "</strong> : " + promos[key].description;
    }
    promoMsg += '</p>';
    // alert(promoMsg);
    showModal(promoMsg);
  } // end if

} // end showPromosAlert

/* alert promotional code information when
    the document is finished loading */
// window.addEventListener('load', function(e) {
//   showPromosAlert();
// });

/* KEEP THIS for use in lieu of above; the above seems to
    execute before all resources are finished loading; */
/* alert promotional code information when
    the document is finished loading */
var checkDOMLoaded = setInterval(function() {
  // console.log(new Date());
  if (document.readyState == 'complete') {
      clearInterval(checkDOMLoaded);
      showPromosAlert();
      // playSound();
    }
}, 1000);

// console.log('document.readyState:', document.readyState);

// ??
// (function ready(fn) {
//   //if (document.readyState != 'loading'){
//   if (document.readyState == 'complete'){
//     fn();
//   } else {
//     // document.addEventListener('DOMContentLoaded', fn);
//   }
// })(showPromosAlert);
