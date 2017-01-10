app.promos = (function(promosData) {

  var _promos;
  var _promoKeys;

  /* always create an empty promo object, even if not to be populated,
    since it will be referenced; */
  function init() {
    _promos = {};
    _promoKeys = {};
    _addPromos(promosData);
    _makePromoKeys(_promos);
  }

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

  function _Promo(promoCode, byMethod, description, percentOff) {
    this.promoCode = promoCode;
    this.byMethod = byMethod;
    this.description = description;
    this.percentOff = percentOff;
    this.isUsed = false;
  };

  function _addPromo(promoCode, byMethod, description, percentOff) {
    _promos[promoCode] = new _Promo(promoCode, byMethod, description, percentOff);
  };

  function _addPromos(somePromos) {
    for (var i=0; i<somePromos.length; i++) {
      _addPromo.apply(null, somePromos[i]);
    }
  }

  function _makePromoKeys(thePromos) {
    for (var key in thePromos) {
      _promoKeys[key] = key;
    }
  }

  function getPromoKeys() {
    return _promoKeys;
  }

  function getPromo(code) {
    return _promos[code];
  }

  function setPromoIsUsed(code, trueFalse) {
    _promos[code].isUsed = trueFalse;
  }

  return {
    init: init,
    getPromoKeys: getPromoKeys,
    getPromo: getPromo,
    setPromoIsUsed: setPromoIsUsed
  };

})(app.promosData);
