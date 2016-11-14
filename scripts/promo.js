var promos = [];

/*
  application: oneItem, allItems, byType
*/
var Promo = function(code, discount, application) {
  this.code = code;
  this.discount = discount;
  this.application = application;
};