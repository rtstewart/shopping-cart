var promos = {};

// promos['ITEM-CA-SR-0775']

/*
  promoCode: string; the code which the user will need to type in to get the promotional discount

  byMethod: string; indicates how the discount is to be applied;
  allowable values are:
  - "item" (discount is applied to a specific item and the promoCode will have the exact format of ITEM-sku);
  - "category" (discount will apply to all items of a specific type/category);
  - "cart" (the discount will apply to the total order)

  percentOff: string; self-explanatory, but use the decimal format as string, i.e., 0.15 is 15% discount
*/

/*
  Promo Code use rules:

  - Only apply 1 promo code at a time;

  - Only apply a promo code if it makes the total price less than the total price with the current promo code;
*/

function Promo(promoCode, byMethod, byMethodDescription, percentOff) {
  this.promoCode = promoCode;
  this.byMethod = byMethod;
  this.byMethodDescription = byMethodDescription;
  this.percentOff = percentOff;
};

function addPromo(promoCode, byMethod, percentOff) {
  promos[promoCode] = new Promo(promoCode, byMethod, byMethodDescription, percentOff);
};

addPromo(

);