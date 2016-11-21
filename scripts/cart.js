// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
// https://developer.mozilla.org/en-US/docs/Web/API/Node
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

var updateCartButtonsArray = document.querySelectorAll('.action-cart .update');
var removeButtonsArray = document.querySelectorAll('.action-cart .remove');
var seeDetailsButtonsArray = document.querySelectorAll('.action-cart .see-detail');

/* Show Details/Hide Details */
for (var i=0; i<seeDetailsButtonsArray.length; i++) {

  seeDetailsButtonsArray[i].addEventListener('click', function(event) {
    event.preventDefault();
    /* get the sku data for this .item-cart */
    var sku = this.parentElement.parentElement.dataset.sku;
    var descriptiveTextDiv = document.querySelector('.item-cart[data-sku="' + sku + '"] .desc-text');
    console.log(this.parentElement.parentElement.dataset.sku);

    if (this.innerHTML == 'Show Details') {
      descriptiveTextDiv.classList.remove('hide');
      descriptiveTextDiv.classList.add('show');
      this.innerHTML = 'Hide Details';
    } else {
      descriptiveTextDiv.classList.remove('show');
      descriptiveTextDiv.classList.add('hide');
      this.innerHTML = 'Show Details';
    }

  });

} // end for (var i=0; i<seeDetailsButtonsArray.length; i++)