app.cartItemHtmlText = (function() {

  cartItemHtmlText =
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

  return cartItemHtmlText;

})();