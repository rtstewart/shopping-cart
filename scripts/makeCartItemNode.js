/* makeCartItemNode.js */

var cartItemHtmlText =
  '<div data-sku="0" class="item-cart">'
  +'\n\n\t<input class="sku" type="hidden" name="item-sku" value="">'
  +'\n\n\t<div class="item-img-container">'
  +'\n\t\t<a href="#!" ><img class="item-img-cart" src=""></a>'
  +'\n\t</div>'
  +'\n\n\t<div class="item-info-cart clear-fix">'
  +'\n\t\t<div class="desc">'
  +'\n\t\t\t<h4></h4>'
  +'\n\t\t\t<p class="item-code">Item Code: <span class="sku"></span></p>'
  +'\n\t\t\t<div class="desc-text hide">'
  +'\n\t\t\t</div>'
  +'\n\t\t</div>'
  +'\n\t\t<div class="price clear-fix"><span title="sale price" tabindex="0">$<span class="item-sale-price"></span></span><span title="regular price" tabindex="0">$<span class="item-regular-price"></span></span></div>'
  +'\n\t</div> <!-- end .item-info-cart -->'
  +'\n\n\t<div class="action-cart">'
  +'\n\t\t<form>'
  +'\n\t\t\t<label>Quantity</label><br>'
  +'\n\t\t\t<input class="quantity" type="number" min="0" max="20" size="2" required>'
  +'\n\t\t\t<button class="update"><i class="fa fa-refresh" aria-hidden="true"></i> Update Cart</button>'
  +'\n\t\t</form>'
  +'\n\t\t<button class="remove"><i class="fa fa-times" aria-hidden="true"></i> Remove</button>'
  +'\n\t\t<button class="see-detail">Show Details</button>'
  +'\n\t</div> <!-- end .action-cart -->'
  +'\n\n\t<div class="item-subtotal">'
  +'\n\t\tItem Subtotal: $<span></span>'
  +'\n\t</div>'
  +'\n</div> <!-- end .item-cart -->';

/* https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment */
/* https://developer.mozilla.org/en-US/docs/Web/API/Element */
function makeCartItemNode(sku, quantity) {
  // ?? this didn't work
  // var newCartItemNode = document.createDocumentFragment();
  // newCartItemNode.innerHTML = cartItemHtmlText;

  /* this technique works for creating the new node */
  var nodeContainer = document.createElement('div');
  nodeContainer.innerHTML = cartItemHtmlText;
  var newCartItemNode = nodeContainer.firstChild;
  // console.log(newCartItemNode);

  /* set the data-sku attribute to the appropriate sku */
  // console.log(newCartItemNode.querySelector('div.item-cart'));
  newCartItemNode.setAttribute('data-sku', sku);
  /* set the value of the input.sku - currently not used */
  newCartItemNode.querySelector('input.sku').setAttribute('value', sku);
  /* set the value for the image URI */
  newCartItemNode.querySelector('img.item-img-cart').setAttribute('src', products[sku].imageUri);
  /* set value for item heading/title */
  newCartItemNode.querySelector('div.desc h4').innerHTML = products[sku].title;

  newCartItemNode.querySelector('span.sku').innerHTML = sku;

  newCartItemNode.querySelector('div.desc-text').innerHTML = products[sku].description;

  if (products[sku].salePrice !== '') {
    /* this sku is on sale */
    newCartItemNode.querySelector('div.price').classList.add('sale');
    newCartItemNode.querySelector('span.item-sale-price').innerHTML = products[sku].salePrice;
    /* make use of the fact that I did this test and populate item subtotal */
    newCartItemNode.querySelector('div.item-subtotal span').innerHTML = (quantity * parseFloat(products[sku].salePrice)).toFixed(2).toString();
  } else {
    /* item not on sale so update subtotal accordingly */
    newCartItemNode.querySelector('div.item-subtotal span').innerHTML = (quantity * parseFloat(products[sku].price)).toFixed(2).toString();
  }

  newCartItemNode.querySelector('span.item-regular-price').innerHTML = products[sku].price

  newCartItemNode.querySelector('input.quantity').value = quantity;

  newCartItemNode.querySelector('input.quantity').setAttribute('title',
    'Update cart quantity must be '
    + newCartItemNode.querySelector('input.quantity').getAttribute('min')
    + ' to ' + newCartItemNode.querySelector('input.quantity').getAttribute('max'));

  return newCartItemNode;

}