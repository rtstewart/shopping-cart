/*
  https://www.nczonline.net/blog/2012/05/08/working-with-files-in-javascript-part-1/
  https://www.nczonline.net/blog/2012/05/15/working-with-files-in-javascript-part-2/
*/

var products = {};
/*
  sku:
  manufacturer:
  title:
  imageUri:
  description:
  category: apparel, merchandise, component, wheel
  discipline: road-racing, triathlon, cyclocross, track
  groupset: super-record-eps, record-eps, chorus-eps, super-record, record,
  chorus, athena, veloce
  price: xx.xx - no $
  sale-price: xx.xx - no $; only include if on sale
  promo: true/false
*/
function Product(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice) {
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
  // this.promo = promo;
};

var productListingHTML = '';

var itemListingHTML = '';

function addProduct(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice) {
  products[sku] = new Product(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice);
};

/* build products{} */
addProduct(
  'ca-r-0739'
  ,'Campagnolo'
  ,'Campagnolo Record Front Hub'
  ,'images/record-road-front-hub.png'
  ,'<p>The new Record™ hubs have been substantially redesigned to exalt the qualities which made the previous ones famous and appreciated all over the world.</p>\n<p>The oversize body design has been accentuated and some parts have been lightened. The highly appreciated adjustable 15-ball bearings have remained unchanged and the ceramic ball kit is available as an option. The quick releases have been redesigned completely; they are now lighter and their operation is based on a symmetrical fulcrum lever. An evolutionary refinement to offer more demanding users the new plus ultra for performance and reliability.</p>\n<p><ul><strong>Features:</strong>\n<li>32 holes</li>\n<li>Light alloy oversize axle and body</li>\n<li>Adjustable bearings</li>\n<li>Quick-release with aluminum lock nuts</li>\n<li>O.L.D.: 100mm</li>\n<li>Weight 116gm</li></ul></p>'
  ,'component'
  ,'Road Racing'
  ,'Super Record'
  ,'101.00'
  ,'90.00'
  );


