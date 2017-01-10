app.promosData = (function() {

/* always create an empty promo object, even if not to be populated,
    since it will be referenced;

    this amounts to always having this file exist, and ...
    if there are not promos to be available, the "thePromos" should be an
    empty array [], and still returned;
*/

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

/* NOTE: use all upper case for alpha characters in promo codes as this will
    be an assumption when checking for valid promo codes;
*/
var thePromos = [

  [
    'ITEM-CA-SR-0716'
    , 'ITEM'
    , 'This promo code will take 10% off of item CA-SR-0716.'
    , '10'
  ],

  [
    'CART-JASMINE'
    , 'CART'
    , 'This promo code will take 5% off of the entire shopping cart subtotal.'
    , '5'
  ],

  [
    'TYPE-MERCHANDISE'
    , 'TYPE'
    , 'This promo code will take 7% off of all items in the "merchandise" category.'
      + '<br>Such items have an item code of the form xx-MD-xxxx, where the "MD" indicates merchandise.'
      + '<br>You can search for such items by category as well using "merchandise" as a filter.'
    , '7'
  ]

];

  return thePromos;

})();
