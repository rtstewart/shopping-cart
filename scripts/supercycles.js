var promosAnchor = document.querySelector('aside ul li a:first-child');

var modal = document.querySelector('.modal');
var modalContainer = document.querySelector('.modal-container');
var modalContent = document.querySelector('.modal-content');
var modalCloseAnchor = document.querySelector('.modal-footer a');

/* creating and inserting a dynamic "top" rule into supercycles.css */
// var dynamicCssRule = '.modal-container {top:' + window.scrollY + 'px;}';
// var styleSheetsArray = document.styleSheets;
// console.log(styleSheetsArray);
// var supercyclesCss;
// for (var i=0; i<styleSheetsArray.length; i++) {
//   if (styleSheetsArray[i].ownerNode.id == 'supercycles-css') {
//     supercyclesCss = styleSheetsArray[i];
//   }
// }
// console.log(supercyclesCss);
// supercyclesCss.insertRule(dynamicCssRule, 0);

modalCloseAnchor.addEventListener('click', function(event) {
  event.preventDefault();
  hideModal();
});

function showModal(alertMsgHtmlText) {
  /* empty contents of .modal-content */
  modalContent.innerHTML = '';
  /* fill .modal-content */
  modalContent.innerHTML = alertMsgHtmlText;

  /* delete "old" top css rule for dynamicCssRule as index 0 of
      supercyclesCss;
      then create new rule based on current scrollY and reinsert at 0; */
  // supercyclesCss.deleteRule(0);
  // dynamicCssRule = '.modal-container {top:' + (scrolledY + 32) + 'px;}';
  // supercyclesCss.insertRule(dynamicCssRule, 0);

  /* show modal */
  modal.classList.remove('invisible');
  modal.classList.add('visible', 'z100');

  /* show modal-container */
  /* first, set top position based on current window.scrollY; */
  modalContainer.style.top = (window.scrollY + 32) + 'px';
  modalContainer.classList.remove('invisible');
  modalContainer.classList.add('visible', 'z100');
}

function hideModal() {
  modalContainer.classList.remove('visible', 'z100');
  modalContainer.classList.add('invisible');

  modal.classList.remove('visible', 'z99');
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
      promoMsg += '<br><br><strong>' + promos[key].promoCode + "</strong> : " + promos[key].description;
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

function playSound() {
    var snd=document.getElementById('rejoice');
    canPlayMP3 = (typeof snd.canPlayType === "function" && snd.canPlayType("audio/mpeg") !== "");
    snd.src=canPlayMP3?'Hallelujah-Chorus-short.mp3':'Hallelujah-Chorus-short.ogg';
    snd.load();
    snd.play();
}