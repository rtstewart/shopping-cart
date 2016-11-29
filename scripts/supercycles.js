var promosAnchor = document.querySelector('aside ul li a:first-child');

promosAnchor.addEventListener('click', function(event) {
  event.preventDefault();
  clickPromosAlert();
});

function clickPromosAlert() {
  /* alert a promos message if the promos object is not empty */
  var promoMsg;
  if (Object.keys(promos).length > 0) {
    var promoMsg = 'There are typically several types of promos available on any given day.'
                  +'\nOnly one promo code can be applied to a purchase.'
                  +'\nOf the promo codes you enter, the one giving the greatest discount will be applied.'
                  +'\n\nToday\'s promo codes and descriptions are as follows:';
    for (var key in promos) {
      promoMsg += '\n\n' + promos[key].promoCode + " : " + promos[key].description;
    }
  } else {
    promoMsg = 'Sorry, there are no promotions available today.\n\nPlease check back tomorrow, as we often add promotions daily.\n\nThank you for shopping at SuperCycles.'
  }
  alert(promoMsg);
}