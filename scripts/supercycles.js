var promosAnchor = document.querySelector('aside ul li a:first-child');

var modal = document.querySelector('.modal');
var modalContainer = document.querySelector('.modal-container');
var modalContent = document.querySelector('.modal-content');
var modalCloseAnchor = document.querySelector('.modal-footer a');

modalCloseAnchor.addEventListener('click', function(event) {
  event.preventDefault();
  hideModal();
});

function showModal(alertMsgHtmlText) {
  /* empty contents of .modal-content */
  modalContent.innerHTML = '';
  /* fill .modal-content */
  modalContent.innerHTML = alertMsgHtmlText;

  /* show modal */
  modal.classList.remove('invisible');
  modal.classList.add('visible,z99');

  // var scrolledY = window.scrollY;

  /* show modal-container */
  modalContainer.classList.remove('invisible');
  modalContainer.classList.add('visible,z100');
  modalContainer.style.top = '"' + scrolledY + 'px"';
  // modalContainer.style.top = 200;
  modalContainer.style.color = "red";
  console.log('scrolledY from showModal:', scrolledY);
}

function hideModal() {
  modalContainer.classList.remove('visible,z100');
  modalContainer.classList.add('invisible');

  modal.classList.remove('visible,z99');
  modal.classList.add('invisible');
}

promosAnchor.addEventListener('click', function(event) {
  event.preventDefault();
  clickPromosAlert();
});

function clickPromosAlert() {
  /* alert a promos message if the promos object is not empty */
  var promoMsg;
  if (Object.keys(promos).length > 0) {
    // var promoMsg = 'There are typically several types of promos available on any given day.'
    //               +'\nOnly one promo code can be applied to a purchase.'
    //               +'\nOf the promo codes you enter, the one giving the greatest discount will be applied.'
    //               +'\n\nToday\'s promo codes and descriptions are as follows:';
    var promoMsg = '<h4>Promotional Codes</h4>'
                  + '<p>- There are typically several types of promos available on any given day.'
                  + '<br>- Only one promo code can be applied to a purchase.'
                  + '<br>- Of the promo codes you enter, the one giving the greatest discount will be applied.</p>'
                  + '<p>Today\'s promo codes and descriptions are as follows:';
    for (var key in promos) {
      // promoMsg += '\n\n' + promos[key].promoCode + " : " + promos[key].description;
      promoMsg += '<br><br>' + promos[key].promoCode + " : " + promos[key].description;
    }
    promoMsg += '</p>';
  } else {
    // promoMsg = 'Sorry, there are no promotions available today.\n\nPlease check back tomorrow, as we often add promotions daily.\n\nThank you for shopping at SuperCycles.';
    promoMsg = '<h4>No Promotions Today</h4>'
                + '<p>Sorry, there are no promotions available today.'
                + '<br><br>Please check back tomorrow, as we often add promotions daily.'
                + '<br><br>Thank you for shopping at SuperCycles.</p>';
  }
  // alert(promoMsg);
  showModal(promoMsg);
}