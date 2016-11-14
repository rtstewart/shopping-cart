/*
  https://www.nczonline.net/blog/2012/05/08/working-with-files-in-javascript-part-1/
  https://www.nczonline.net/blog/2012/05/15/working-with-files-in-javascript-part-2/
*/

var products = {};
/*
  category: apparel, merchandise, component, wheel
  discipline: road-racing, triathlon, cyclocross, track
  groupset: super-record-eps, record-eps, chorus-eps, super-record, record,
  chorus, athena, veloce
  sku:
  title:
  description:
  price:
  sale-price:
*/
function Product(sku, title, imageUri, description, category, price, salePrice, discipline, groupset) {
  this.sku = sku;
  this.title = title;
  this.imageUri = imageUri;
  this.description = description;
  this.category = category;
  this.price = price;
  this.salePrice = salePrice;
  this.discipline = discipline;
  this.groupset = groupset;
};

function addProduct(sku, title, imageUri, description, category, price, salePrice, discipline, groupset) {
  products[sku] = new Product(sku, title, imageUri, description, category, price, salePrice, discipline, groupset);
};

