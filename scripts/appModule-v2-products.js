app.products = (function(productsData) {

  var _products;

  function init() {
    _products = {};
    _addProducts(productsData);
  }

  function _Product(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice) {
    this.sku = sku;
    this.manufacturer = manufacturer;
    this.title = title;
    this.imageUri = imageUri;
    this.description = description;
    this.category = category;
    this.discipline = discipline;
    this.groupset = groupset;
    this.price = price;
    this.salePrice = salePrice;
  }

  function _addProduct(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice) {
    if(sku in _products) {
      console.error('product with sku ' + sku + ' already exists');
      // error
    } else {
      _products[sku] = new _Product(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice);
    }
  }

  function _addProducts(someProducts) {
    for (var i=0; i<someProducts.length; i++) {
      _addProduct.apply(null, someProducts[i]);
    }
  }

  function getProduct(sku) {
    return _products[sku];
  }

  return {
    init: init,
    getProduct: getProduct
  };

})(app.productsData);