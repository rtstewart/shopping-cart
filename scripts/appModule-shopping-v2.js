/*
  https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes
  https://developer.mozilla.org/en-US/docs/Web/API/Node
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
  http://www.regular-expressions.info/alternation.html
  maybe use pattern="^(promoCode1text|promoCode2text|promoCode3text)$"
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  - not sure about useCapture option for addEventListener;
*/

app.shopping = (function() {

  /* items previously in supercycles.js below */
  var promosAnchor;

  var modal;
  var modalContainer;
  var modalContent;
  var modalCloseAnchor;
  /* items previously in supercycles.js above */

  /* always create an empty promo object, even if not to be populated,
      since it will be referenced;
  */
  var checkDOMLoaded;
  var promos;
  var products;
  /* cartItems {} will have the following structure:
      {
        sku:quantity,
        .
        .
        .
        sku:quantity
      }
  */
  var cartItems;
  var cartItemHtmlText;

  /* the main 2 pages to alternately display/hide */
  var productListing;
  var cartListing;

  /* show cart buttons/widgets within Supercycles nav, and .listing-container */
  var showCartButtonInMain;
  var showCartButtonInListing;

  var cartTotalQuantityMain;
  var cartTotalQuantityListing;

  /* cart header and footer, and associated action elements */

  /* NOTE in our "mock" shopping scenario here, these elements already exist in
      the DOM so we can reference them already;
      Normally, they might be created dynamically and would have to be dealt with
      more like the cart items below with regard to event listeners and so forth.
  */
  var cartHeader;
  var cartFooter;

  /* cart summary header/footer elements that will need to be updated */
  var cartQuantitySpanArray;
  var cartSubtotalTdArray;
  var cartPromoCodeSpanArray;
  var cartPromoDiscountTdArray;
  var cartTotalTdArray;

  /* cart summary header/footer elements that will need event listeners */
  var promoCodeInputArray;

  function init() {
    /* items previously in supercycles.js below */
    promosAnchor = document.querySelector('aside ul li a:first-child');

    modal = document.querySelector('.modal');
    modalContainer = document.querySelector('.modal-container');
    modalContent = document.querySelector('.modal-content');
    modalCloseAnchor = document.querySelector('.modal-footer a');
    /* items previously in supercycles.js above */

    promos = {};
    createPromos();
    products = {};
    createProducts();
    cartItems = {};

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

    /* the main 2 pages to alternately display/hide */
    productListing = document.querySelector('.listing-container');
    cartListing = document.querySelector('.shopping-cart');

    /* show cart buttons/widgets within Supercycles nav, and .listing-container */
    showCartButtonInMain = document.querySelector('nav .show-cart-main');
    showCartButtonInListing = document.querySelector('.listing-container .show-cart-listing');
    /* disable the show cart buttons initially, and when total cart items is zero */
    showCartButtonInMain.disabled = true;
    showCartButtonInListing.disabled = true;

    cartTotalQuantityMain = document.querySelector('div.cart-quantity-all-main');
    cartTotalQuantityListing = document.querySelector('div.cart-quantity-all-listing');

    /* cart header and footer, and associated action elements */

    cartHeader = document.querySelector('#cart-header');
    cartFooter = document.querySelector('#cart-footer');

    /* cart summary header/footer elements that will need to be updated */
    cartQuantitySpanArray = document.querySelectorAll('span.cart-quantity');
    cartSubtotalTdArray = document.querySelectorAll('td.cart-subtotal');
    cartPromoCodeSpanArray = document.querySelectorAll('span.promo-code');
    cartPromoDiscountTdArray = document.querySelectorAll('td.cart-promo-discount');
    cartTotalTdArray = document.querySelectorAll('.shopping-cart td.cart-total');

    /* cart summary header/footer elements that will need event listeners */
    promoCodeInputArray = document.querySelectorAll('.shopping-cart input.promo-code');

    _addListeners();

    checkDOMLoaded = setInterval(function() {
      // console.log(new Date());
      if (document.readyState == 'complete') {
          clearInterval(checkDOMLoaded);
          showPromosAlert();
        }
    }, 1000);
  } // end init

  function Promo(promoCode, byMethod, description, percentOff) {
    this.promoCode = promoCode;
    this.byMethod = byMethod;
    this.description = description;
    this.percentOff = percentOff;
    this.isUsed = false;
  }

  function addPromo(promoCode, byMethod, description, percentOff) {
    promos[promoCode] = new Promo(promoCode, byMethod, description, percentOff);
  }

  function createPromos() {

    addPromo(
      'ITEM-CA-SR-0716'
      , 'ITEM'
      , 'This promo code will take 10% off of item CA-SR-0716.'
      , '10'
    );

    addPromo(
      'CART-JASMINE'
      , 'CART'
      , 'This promo code will take 5% off of the entire shopping cart subtotal.'
      , '5'
    );

    addPromo(
      'TYPE-MERCHANDISE'
      , 'TYPE'
      , 'This promo code will take 7% off of all items in the "merchandise" category.'
        + '<br>Such items have an item code of the form xx-MD-xxxx, where the "MD" indicates merchandise.'
        + '<br>You can search for such items by category as well using "merchandise" as a filter.'
      , '7'
    );

  } // end createPromos

  function showPromosAlert() {
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
      // alert(promoMsg);
      showModal(promoMsg);
    } // end if

  } // end showPromosAlert

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
  }

  function addProduct(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice) {
    products[sku] = new Product(sku, manufacturer, title, imageUri, description, category, discipline, groupset, price, salePrice);
  }

  function createProducts() {

    addProduct(
      'CA-R-0739'
      ,'Campagnolo'
      ,'Campagnolo Record Front Hub'
      ,'images/record-road-front-hub.png'
      ,'<p>The new Record™ hubs have been substantially redesigned to exalt the qualities which made the previous ones famous and appreciated all over the world.</p>\n<p>The oversize body design has been accentuated and some parts have been lightened. The highly appreciated adjustable 15-ball bearings have remained unchanged and the ceramic ball kit is available as an option. The quick releases have been redesigned completely; they are now lighter and their operation is based on a symmetrical fulcrum lever. An evolutionary refinement to offer more demanding users the new plus ultra for performance and reliability.</p>\n<p><ul><strong>Features:</strong>\n<li>32 holes</li>\n<li>Light alloy oversize axle and body</li>\n<li>Adjustable bearings</li>\n<li>Quick-release with aluminum lock nuts</li>\n<li>O.L.D.: 100mm</li>\n<li>Weight 116gm</li></ul></p>'
      ,'component'
      ,'Road Racing'
      ,'Record'
      ,'100.00'
      ,''
    );

    addProduct(
      'CA-R-0740'
      , 'Campagnolo'
      , 'Campagnolo Record Rear Hub'
      , 'images/record-road-rear-hub.png'
      , '<p>The new Record™ hubs have been substantially redesigned to exalt the qualities which made the previous ones famous and appreciated all over the world.</p>\n<p>The oversize body design has been accentuated, some parts have been lightened, and the freewheel body is made entirely of light alloy. The highly appreciated adjustable 15-ball bearings have remained unchanged and the ceramic ball kit is available as an option. The quick releases have been redesigned completely; they are now lighter and their operation is based on a symmetrical fulcrum lever. An evolutionary refinement to offer more demanding users the new plus ultra for performance and reliability.</p>\n<p><ul><strong>Features:</strong>\n<li>10 Speed</li>\n<li>32 holes</li>\n<li>Light alloy body, axle, and one-piece freewheel body, with Titanium pawls</li>\n<li>Adjustable bearings</li>\n<li>Quick-release with aluminum lock nuts</li>\n<li>Lockring thread 27x1</li>\n<li>O.L.D.: 130mm</li>\n<li>Weight 231gm</li></ul></p>'
      , 'component'
      , 'Road Racing'
      , 'Record'
      , '199.00'
      , ''
    );

    addProduct(
      'CA-SR-0789'
      , 'Campagnolo'
      , 'Campagnolo Super Record Brake Calipers'
      , 'images/super-record-brake-caliper.png'
      , '<p>For a fast descent you need a safe and reliable braking system that is powerful and adjustable. The Super Record system guarantees shorter braking distance and complete control of breaking power thanks to our Skeleton™ arm design and new brake pads.</p>\n<p>In its standard version Campagnolo® offers the classic front brake Dual Pívot and rear brake Mono Pívot design to provide maximum braking power modulation. But for those looking for the maximum braking power, even at the rear, Campagnolo® offers the rear brake Dual Pívot option.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '355.00'
      , ''
    );

    addProduct(
      'CA-SR-0765'
      , 'Campagnolo'
      , 'Campagnolo Super Record Ergopower Controls'
      , 'images/super-record-ergopower-control.png'
      , '                <p>Dominate your bike at every turn, relax on the long straights, and prepare for the final sprint: whatever your racing position, Ergopower™ controls, with the exclusive Campagnolo® mechanism, allows you to shift up 3 sprockets at a time and down 5 sprockets.</p>\n<p>The Super Record™ series Ergopower™ Ultra-Shift™ controls, now also available with red or white hoods, are the top product in terms of technology applied to ergonomics - all to the advantage of safety, speed and precision in using the controls.</p>\n<p>Make every movement natural, fast and precise. Your every wish is a command.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '631.00'
      , '500.00'
    );

    addProduct(
      'CA-SR-0742'
      , 'Campagnolo'
      , 'Campagnolo Super Record Rear Derailleur'
      , 'images/super-record-rear-derailleur.png'
      , '<p>The Campagnolo Super Record 11 Rear Derailleur features full carbon fiber upper and lower bodies, executing the commands from the Ergopower shifters with extreme precision. The cage pulleys are made of anti-vibration material to provide maximum smoothness and the parallelogram shape delivers more torsional rigidity than the old design, while ceramic bearings on the bottom pulleys ensure low friction and long life. The new shape of the external components enables the rear derailleur to move according to a different angle and the new internal design keeps the chain nearer the cassette to ensure better power transmission, greater and more secure traction, a better chain/sprocket interface and greater durability of components subject to wear and tear. An anodized aluminum fixing screw further reduces weight.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '500.00'
      , '395.00'
    );

    addProduct(
      'CA-SR-0744'
      , 'Campagnolo'
      , 'Campagnolo Super Record Front Derailleur'
      , 'images/super-record-front-derailleur.png'
      , '<p>By optimizing the geometry and repositioning the pull of the cable, the Campagnolo Super Record 11 front derailleur now delivers faster and more precise shifting for unrivalled precision and speed. The stiff derailleur cage is made from a combination of aluminum and carbon fiber to provide longevity and light weight. Titanium screws and inserts further ensure lightness and long wear. The Super Record front derailleur with Ultra Shift geometries combined with the Campagnolo crankset and chain guarantee the best of shifting performance under any condition. The S2 (Secure Shifting System) version safeguards working of the drivetrain, guaranteeing maximum compatibility with frames on the market. Check with your frame manufacturer to determine which model is recommended. Use the Campagnolo Front Derailleur Adaptor Clamp with the braze-on derailleur for seat tube clamp applications.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '175.00'
      , ''
    );

    addProduct(
      'CA-SR-0775'
      , 'Campagnolo'
      , 'Campagnolo Super Record Crankset'
      , 'images/super-record-crankset.png'
      , '<p>The maximum that you could ask for in performance and smoothness. The Super Record™ crankset is an extraordinary concentration of technology and performance: extremely high overall stiffness, extraordinary lightness, fast and precise shifting; the CULT™ system and the option with titanium axle, all this enhances even more the performance and uniqueness of this crankset.</p>\n<p>The use of unidirectional and multidirectional carbon fiber in the Ultra-Hollow structure gives the Campagnolo Super Record 11 Ultra-Torque Titanium Crankset rigidity and lightness. The titanium spindle is lighter than the standard Ultra-Torque spindle, saving 40 grams. Campagnolo\'s Extreme Performance Shifting System (XPSS) was specially developed to improve shift timing, and features a redesigned tooth profile to optimize their 11-speed operation. Thanks to the new chainring design, there are now eight sectors specialized for upshifting, and two diametrically opposed sectors for downshifting. This makes instantaneous and precise shifting possible both up and down. The ceramic bearings provide the best combination of smoothness, resistance to corrosion, and long life.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '940.00'
      , '740.00'
    );

    addProduct(
      'CA-SR-0716'
      , 'Campagnolo'
      , 'Campagnolo Super Record Cassette'
      , 'images/super-record-cassette.png'
      , '<p>Maximum performance and low noise, with no compromise on components. With this in mind, Campagnolo® engineers designed our Super Record™ sprockets with a double frame on the last two sprocket triplets. This results in a more solid and lighter frame, thanks to the use of titanium in the 6 larger sprockets. The Ultra-Shift™ teeth design has been upgraded to make shifting faster, with perfect synchronization, and to eliminate chain stress.</p>\n<p>Campagnolo\'s top-tier groupset features Ultra Shift technology, meaning each and every tooth of the Super Record 11 cassette is shaped to perform a specific function. Whether the chain is being lifted or lowered, Ultra Shift relieves pressure on the chain, the rear derailleur, and the cassette itself. This results in unbelievably quick and quiet shifting that you can rely on. The Super Record 11 Cassette is built with both titanium and steel, providing the perfect combination of lightness and durability. The six largest cogs are made out of titanium, lightening the cassette considerably. Because the smallest cogs see more use and thus wear faster, Campagnolo built these with a sturdy nickel/chrome-coated steel. In addition to shaving weight with the 6 Ti cogs, the Super Record 11 cassette features a lightweight alloy lockring and a splined aluminum frame, which also increases the overall torsional stiffness.</p>'
      , 'component'
      , 'Road Racing'
      , 'Super Record'
      , '430.00'
      , ''
    );

    addProduct(
      'CA-R-0791'
      , 'Campagnolo®'
      , 'Campagnolo Record Chain'
      , 'images/record-chain.png'
      , '<p>Pros are the everyday testing ground for the chain fitted on all advanced Record™ 11 and Super Record™ 11 groups. Bike links and pins have been designed to adhere perfectly to gears and sprockets\' teeth providing maximum fluidity, reduced friction and improved chain life.</p>\n<p>Campagnolo has lightened the weight of the hollow pins for the Record 11 chain, further reducing this super light, extremely strong chain. A proprietary Ni-PTFE anti-friction treatment makes each pedal stroke smooth and silent while lengthening the life of the chain. The Ultra-Link fastening system guarantees strength and seamless operation with the 11-speed sprockets.</p>'
      , 'component'
      , 'Road Racing'
      , 'Record/Super Record'
      , '60.00'
      , ''
    );

    addProduct(
      'CA-MD-1623'
      , 'Campagnolo'
      , 'Campagnolo BIG Corkscrew'
      , 'images/Campagnolo_corkscrew_bronze.png'
      , '<p>Campagnolo’s signature artisanship gives the corkscrew its very own distinctive, unique personality. Each stage of its manufacture takes place in Vicenza, in the hands of those who, for years, have used their experience to make Campagnolo products.</p><p>Quality materials and careful finishes accompany the sinuous shapes of its various parts. Each component is a characteristic feature of the Campagnolo brand. Like the screws, still today the heirs of a seventies Super Record crankset, an element that adorned the bikes of great names from the past – the likes of Merckx, Indurain and Gimondi.</p>\n<p>A telescopic, self-centering bell positions the screw exactly in the middle of the cork and once screwed down, the two levers pull the cork out easily and delicately. This means that the bottle does not get shaken, which would disturb the sediment typical of aged wines. The corkscrew has also been designed to never twist completely through the cork, thus preventing pieces of cork dropping into the wine.</p>'
      , 'merchandise'
      , ''
      , ''
      , '180.00'
      , '165.00'
    );

    addProduct(
      'CA-MD-1645'
      , 'Campagnolo'
      , 'Yellow Campagnolo cycling cap - Classic Edition'
      , 'images/7223_n_GIALLO-tre4.png'
      , '<p>Campagnolo brings back the original cycling cap in its most classic of shapes, recognizable the world over. Racing yellow and black logos are teamed with a rainbow strip, the symbol of races from yesteryear, of cycling by great champions.</p>\n<p>Over time, this object has become a distinctive element for the world of cycling and elsewhere, worn by various celebs during filming of many video clips and films.</p>\n<p>An element as sought after as it is copied all over the world, the original, the authentic, it is today only available from the Campagnolo online store.</p>\n<p>As for all the products that bear the Campagnolo brand, in this case too the top-quality fabric, finishes and manufacture make this version of the Campagnolo Classic Cap a must-have for all cycling fans.</p>'
      , 'merchandise'
      , ''
      , ''
      , '38.00'
      , ''
    );

  } // end createProducts

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

  } // end makeCartItemNode

  function hideListShowCart(event) {
    /* productListing is 'this' in here, since the listener for it
        will call this function;
        for an event listener function, 'this' is always the element
        on which the listener was bound to; */
    if (this.classList.contains('goaway')) {
      // this.style.display = 'none';
      this.classList.remove('show');
      this.classList.add('hide');
      cartListing.classList.remove('goaway');
      // cartListing.style.display = 'block';
      cartListing.classList.remove('hide');
      cartListing.classList.add('show');
      cartListing.classList.add('comeback');
    }
  }

  function hideCartShowList(event) {
    /* cartListing is 'this' in here, since the listener for it
        will call this function;
        for an event listener function, 'this' is always the element
        on which the listener was bound to; */
    if (this.classList.contains('goaway')) {
      // this.style.display = 'none';
      this.classList.remove('show');
      this.classList.add('hide');
      productListing.classList.remove('goaway');
      // productListing.style.display = 'block';
      productListing.classList.remove('hide');
      productListing.classList.add('show');
      productListing.classList.add('comeback');
    }
  }

  function hideProductListing(event) {
      productListing.classList.remove('comeback');
      productListing.classList.add('goaway');
  }

  function hideCartListing(event) {
      cartListing.classList.remove('comeback');
      cartListing.classList.add('goaway');
  }

  /* items previously in supercycles.js below */
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

  function hideModal(event) {
    event.preventDefault();
    modalContainer.classList.remove('visible', 'z100');
    modalContainer.classList.add('invisible');

    modal.classList.remove('visible', 'z99');
    modal.classList.add('invisible');
  }

  function clickPromosAlert() {
    /* this function differs from showPromosAlert in shopping in that it will
        show a message indicating that there are no promos available if the
        promos object is empty, showPromosAlert does not, it only shows a
        message at all if there are any */

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
  } // end clickPromosAlert
  /* items previously in supercycles.js above */

  function _showHide(event) {
    productListing.classList.add('hide');
    cartListing.classList.remove('hide');
  }

  function _addToCartSubmit(event) {
    /* this will capture the attempted submission of an
        "Add to cart" value via clicking on that button, which
        is the submit button for the parent form element; */
    event.preventDefault();

    /* the following will only get executed upon a valid submission of quantity */
    /* get the sku associated with the particular "Add to cart" button clicked; */
    /* just as an FYI in here:
        'this' is .listing-container;
        'event.target' is the form element associated with the submit event; */
    var sku = event.target.parentElement.parentElement.dataset.sku;

    var associatedQuantityInput = event.target.querySelector('.quantity');
    /* NOTE: quantity could include a leading + in value; */
    var quantity = associatedQuantityInput.value;
    var associatedAddToCartButton = event.target.querySelector('.add-to-cart');
    /* in case there is a leading + in value, this will get rid of it; */
    quantity = parseInt(associatedQuantityInput.value);
    associatedQuantityInput.value = '';
    associatedQuantityInput.value = quantity;

    /* change text on Add to Cart button, and disable it and the associated input */
    associatedAddToCartButton.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Item in cart';
    /* disable button and input */
    associatedQuantityInput.disabled = true;
    associatedAddToCartButton.disabled = true;

    /* create and add item node to cart */
    var nodeToInsert = makeCartItemNode(sku, quantity);
    // console.log('nodeToInsert:', nodeToInsert);

    /* https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore */
    cartListing.insertBefore(nodeToInsert, cartFooter);

    /* update cartItems object with new item addition */
    cartItems[sku] = quantity;

    /* update cart summary header/footer */
    updateCartSummary();

    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    for (key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }

    /* update .cart-quantity-all in Supercycles, and "widget" in listing */
    cartTotalQuantityMain.innerHTML = cartNumItems.toString();
    cartTotalQuantityListing.innerHTML = cartNumItems.toString();

    /* enable show cart buttons/widgets */
    showCartButtonInMain.disabled = false;
    showCartButtonInListing.disabled = false;

  } // end _addToCartSubmit

  function _updateCartSubmit(event) {
    /* submit event already filters out non-form buttons */
    /* there are submit buttons in the cart header and footer,
        as well as on each cart item's form */
    event.preventDefault();
    /* just as an FYI in here:
        'this' is .shopping-cart;
        'event.target' is the form element associated with the submit event; */
    /* the submit event could only have been triggered by the submit button
        in the form element (event.target), so address that; */

    /* we will only get to execute below, if the form has validated as valid; */

    /* event.target is <form> in here */
    /* see which button was used to submit */
    var submitButton = event.target.querySelector('button');

    if (submitButton.classList.contains('update')) {
      /* here, we know it was an "Update Cart" button */
      /* no custom validation was done for this form */
      updateCartFromForm(event.target);
    } else if (submitButton.classList.contains('apply-promo')) {
      /* here, we know it was an "Apply Promo" button */
      /* custom validation was done for this form */
      /* prior validation has determined that the trimmed, uppercased-value
          is a valid and currently unused promotional code, so pass the
          trimmed, uppercased-value to updateCartSummary() */
      updateCartSummary(event.target.querySelector('input.promo-code').value.trim().toUpperCase());
    } // end if (submitButton.classList.contains('quantity'))

  } // end _updateCartSubmit

  function _cartButtonsClick(event) {
    /* address click event for buttons/elements other than "Update Cart"; */

    /* get the button/element that was clicked */
    var clickedElement = event.target;
    var associatedCartItem = clickedElement.parentElement.parentElement;

    if (clickedElement.classList.contains('apply-promo')) {
      /* we are "intercepting" the Apply promo submission, by listening for the
          'click' event on that element, to do custom validation; */
      var associatedInput = clickedElement.parentElement.querySelector('input.promo-code');
      if (associatedInput.value.trim() == '') {
         associatedInput.setCustomValidity('Please supply a Promo Code to apply.');
      } else if (associatedInput.value.trim().toUpperCase() in promos) {
          /* we have a valid input promo code here; */
          // associatedInput.setCustomValidity('');
          if (promos[associatedInput.value.trim().toUpperCase()].isUsed) {
            /* promo code is already being used, so don't submit */
            associatedInput.setCustomValidity(associatedInput.value.trim().toUpperCase() + ' is already being used.');
            setTimeout(clearInputValue(associatedInput), 1000);
          } else {
              /* we now know we have a valid, currently-unused promo code; */
              /* since clicking the .apply-promo button submits the parent form
                  we setCustomValidity('') so the form validates to valid;
                  we then call updateCartSummary from the 'submit' event listener
                  so that the cart only gets updated upon submission of a valid and
                  currently-unused promo code */
              associatedInput.setCustomValidity('');
          }
      } else {
          associatedInput.setCustomValidity(associatedInput.value + ' is not a valid Promotional Code.');
          setTimeout(clickPromosAlert, 2500);
      }
    } else if (clickedElement.classList.contains('keep-shopping')) {
        // cartListing.classList.add('hide');
        // productListing.classList.remove('hide');
        hideCartListing();
    } else if (clickedElement.classList.contains('checkout')) {
        justTesting();
    } else if (clickedElement.classList.contains('remove')) {
        removeCartItem(associatedCartItem);
    } else if (clickedElement.classList.contains('see-detail')) {
        showHideItemDetail(clickedElement);
    } else if (clickedElement.innerHTML == 'Promotional Code:') {
        clickPromosAlert();
    }

  } // end _cartButtonsClick

  function showHideItemDetail(clickedButton) {
    /* get the sku data for this .item-cart */
    var sku = clickedButton.parentElement.parentElement.dataset.sku;
    var descriptiveTextDiv = document.querySelector('.item-cart[data-sku="' + sku + '"] .desc-text');
    // console.log(this.parentElement.parentElement.dataset.sku);

    if (clickedButton.innerHTML == 'Show Details') {
      descriptiveTextDiv.classList.remove('hide');
      descriptiveTextDiv.classList.add('show');
      clickedButton.innerHTML = 'Hide Details';
    } else {
      descriptiveTextDiv.classList.remove('show');
      descriptiveTextDiv.classList.add('hide');
      clickedButton.innerHTML = 'Show Details';
    }
  } // end showHideItemDetail

  function updateCartFromForm(theFormElement) {
    /* event.target is <form> */
    var associatedQuantityInput = theFormElement.parentElement.querySelector('input.quantity');
    /* NOTE: updateQuantity could include a leading + in value; */
    var updateQuantity = associatedQuantityInput.value;

    var associatedCartItem =  theFormElement.parentElement.parentElement;
    var sku = associatedCartItem.dataset.sku;
    var associatedCartItemSubtotalSpan = associatedCartItem.querySelector('div.item-subtotal span');

    var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
    var associatedListingQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');

    /* in case there is a leading + in value, this will get rid of it; */
    updateQuantity = parseInt(associatedQuantityInput.value);
    associatedQuantityInput.value = '';
    associatedQuantityInput.value = updateQuantity;

    /* update associated listing item quantity and Add to cart button */
    if (updateQuantity == 0) {
      removeCartItem(associatedCartItem);
    } else {
        /* update cartItems object with non-zero value */
        cartItems[sku] = associatedQuantityInput.value;
        /* check cart and respond accordingly to total number of items */
        checkCartItemsQuantity();
        /* set associated listing quantity to the new non-zero value */
        associatedListingQuantityInput.value = cartItems[sku];
        /* update item subtotal in cart item */
        if (products[sku].salePrice !== '') {
          /* item is on sale */
          associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products[sku].salePrice).toFixed(2).toString();
        } else {
          /* item is not on sale */
          associatedCartItemSubtotalSpan.innerHTML = (cartItems[sku] * products[sku].price).toFixed(2).toString();
        }
    } // end if (associatedQuantityInput.value == '0')

    updateCartSummary();

  } // end updateCartFromForm

  function playSound() {
      var snd=document.getElementById('rejoice');
      canPlayMP3 = (typeof snd.canPlayType === "function" && snd.canPlayType("audio/mpeg") !== "");
      snd.src=canPlayMP3?'Hallelujah-Chorus-short.mp3':'Hallelujah-Chorus-short.ogg';
      snd.load();
      snd.play();
  }

  function justTesting() {
    playSound();
    showModal('<h4>Hallelujah!</h4><p>You decided to buy something.<br><br>Just wanted to test your curiosity ;-)</p>');
  } // end function justTesting

  function checkCartItemsQuantity() {
    /* this will check and update globally available things that
        need to be checked/updated when cartItems changes; */

    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    for (var key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }

    /* update .cart-quantity-all in Supercycles, and "widget" in listing */
    cartTotalQuantityMain.innerHTML = cartNumItems.toString();
    cartTotalQuantityListing.innerHTML = cartNumItems.toString();

    if (cartNumItems == 0) {
      /* cart is now empty */

      /* with nothing in cart, if a promo code is set as used, make it unused */
      for (key in promos) {
        if (promos[key].isUsed) {
          promos[key].isUsed = false;
        }
      }

      /* disable show cart buttons/widgets */
      showCartButtonInMain.disabled = true;
      showCartButtonInListing.disabled = true;

      /* display product listing, and hide cart */
      // productListing.classList.remove('hide');
      // cartListing.classList.add('hide');
      hideCartListing();
    }

    if (cartNumItems > 0) {
      /* test to see if any currently used promo code exists,
          and if so, see if it now applies to anything in the
          cart now that item(s) have been removed/changed;
      */
      for (key in promos) {
        /* see if anything in cart applies to it */
        if (promos[key].isUsed) {
          /* found a promo already being used, so calculate the resulting discount */

          switch (promos[key].byMethod) {
            case 'ITEM':
              var discountedItemCode = key.slice(5);
              /* if this specific item (discountedItemCode) does not exist in
                  cart anymore, then set the promo code to unused/false;
              */
              if (!cartItems[discountedItemCode]) {
                promos[key].isUsed = false;
              }
              break;
            case 'CART':
              /* if anything is left in cart, this promo code will apply,
                  so don't do anything with its used/unused property;
              */
              break;
            case 'TYPE':
              var discountCategory = key.slice(5).toLowerCase();
              /* set to unused, then see if something in cart uses it */
              promos[key].isUsed = false;
              for (var prodKey in cartItems) {
                if (discountCategory == products[prodKey].category) {
                  promos[key].isUsed = true;
                }
              }
              break;
            default:
              // alert('Something went wrong with EXISTING promo discount calculation.');
          } // end switch (promos[key].byMethod)

        } // end if (promos[key].isUsed)

      } // end for (var key in promos)

    } // end if (cartNumItems > 0)

    /* just in case I want to retrieve the numerical result */
    return cartNumItems;

  } // end checkCartItemsQuantity

  function getCartItemsQuantity() {
    /* get total number of items in cartItems object */
    var cartNumItems = 0;
    for (var key in cartItems) {
      cartNumItems += parseInt(cartItems[key]);
    }
    return cartNumItems;
  } // end getCartItemsQuantity

  function updateCartSummary(newPromoCode) {
    /* newPromoCode only gets sent in when it is valid, and currently not used;
        it is not sent in when an item is added to the cart and this function
        gets called;
        so, newPromoCode could be undefined;
    */
    var cartSubtotal = 0;
    var existingPromoCode;
    var existingPromoCodeDiscount = 0;
    var newPromoCodeDiscount = 0;
    var appliedPromoCode;
    var appliedPromoCodeDiscount;
    var numCartItems;
    var cartTotal = 0;
    var discountedItemCode;
    var itemPrice;
    var discountCategory;
    for (var key in cartItems) {
      if (products[key].salePrice == '') {
        /* this item is not on sale */
        cartSubtotal += cartItems[key] * products[key].price;
      } else {
        /* this item is on sale */
        cartSubtotal += cartItems[key] * products[key].salePrice;
      }
    } // end for

    /* assign cart total prior to discount calculations */
    cartTotal += cartSubtotal;

    /* calculate discount from existing used promo if any */
    for (key in promos) {

      if (promos[key].isUsed) {
        /* found a promo already being used, so calculate the resulting discount */
        existingPromoCode = key;

        switch (promos[key].byMethod) {
          case 'ITEM':
            discountedItemCode = key.slice(5);
            /* only look to apply the discount if the item exists in the car */
            if (cartItems[discountedItemCode]) {
              if (products[discountedItemCode].salePrice == '') {
                /* item is NOT also on sale */
                itemPrice = products[discountedItemCode].price;
              } else {
                /* item IS also on sale */
                itemPrice = products[discountedItemCode].salePrice;
              }
              existingPromoCodeDiscount = cartItems[discountedItemCode] * itemPrice * promos[key].percentOff * 0.01;
            }
            break;
          case 'CART':
            existingPromoCodeDiscount = cartSubtotal * promos[key].percentOff * 0.01;
            break;
          case 'TYPE':
            discountCategory = key.slice(5).toLowerCase();
            for (var prodKey in cartItems) {
              if (discountCategory == products[prodKey].category) {
                if (products[prodKey].salePrice == '') {
                  /* item is NOT also on sale */
                  itemPrice = products[prodKey].price;
                } else {
                    /* item IS also on sale */
                    itemPrice = products[prodKey].salePrice;
                }
                existingPromoCodeDiscount += cartItems[prodKey] * itemPrice * promos[key].percentOff * 0.01;
              }
            }
            break;
          default:
            // alert('Something went wrong with EXISTING promo discount calculation.');
        } // end switch (promos[key].byMethod)

      } // end if (promos[key].isUsed)

    } // end for (key in promos)

    /* if newPromoCode is not undefined, it was supplied as valid and unused */
    if (newPromoCode) {
      switch (promos[newPromoCode].byMethod) {

        case 'ITEM':
          discountedItemCode = newPromoCode.slice(5);
          /* only look to apply the discount if the item exists in the car */
          if (cartItems[discountedItemCode]) {

            if (products[discountedItemCode].salePrice == '') {
              /* item is NOT also on sale */
              itemPrice = products[discountedItemCode].price;
            } else {
              /* item IS also on sale */
              itemPrice = products[discountedItemCode].salePrice;
            }
            newPromoCodeDiscount = cartItems[discountedItemCode] * itemPrice * promos[newPromoCode].percentOff * 0.01;

          } // end if (cartItems[discountedItemCode])
          break;
        case 'CART':
          newPromoCodeDiscount = cartSubtotal * promos[newPromoCode].percentOff * 0.01;
          break;
        case 'TYPE':
          discountCategory = newPromoCode.slice(5).toLowerCase();
          for (prodKey in cartItems) {
            if (discountCategory == products[prodKey].category) {
              if (products[prodKey].salePrice == '') {
                /* item is NOT also on sale */
                itemPrice = products[prodKey].price;
              } else {
                  /* item IS also on sale */
                  itemPrice = products[prodKey].salePrice;
              }
              newPromoCodeDiscount += cartItems[prodKey] * itemPrice * promos[newPromoCode].percentOff * 0.01;
            }
          }
          break;
        default:
          // alert('Something went wrong with NEW promo discount calculation.');
      } // end switch (promos[key].byMethod)
    }

    /* should now have a promoDiscount amount here, if any;
        now, to figure out if we have any or both promos,
        and if so, which to use;
    */
    if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount != 0) {
      if (newPromoCodeDiscount > existingPromoCodeDiscount) {
        /* apply new promo instead of existing */
        promos[existingPromoCode].isUsed = false;
        promos[newPromoCode].isUsed = true;
        appliedPromoCode = newPromoCode;
        appliedPromoCodeDiscount = newPromoCodeDiscount;
      } else {
        /* existing promo stays in effect */
        appliedPromoCode = existingPromoCode;
        appliedPromoCodeDiscount = existingPromoCodeDiscount;
      }
    } else if (existingPromoCodeDiscount == 0 && newPromoCodeDiscount == 0) {
      /* no promo is applied */
      appliedPromoCode = '';
      appliedPromoCodeDiscount = 0;

    } else if (existingPromoCodeDiscount == 0 && newPromoCodeDiscount != 0) {
      promos[newPromoCode].isUsed = true;
      appliedPromoCode = newPromoCode;
      appliedPromoCodeDiscount = newPromoCodeDiscount;
    } else if (existingPromoCodeDiscount != 0 && newPromoCodeDiscount == 0) {
      promos[existingPromoCode].isUsed = true;
      appliedPromoCode = existingPromoCode;
      appliedPromoCodeDiscount = existingPromoCodeDiscount;
    }

    /* apply promo discount, if any, to cartTotal */
    cartTotal -= appliedPromoCodeDiscount;

    /* correct evaluation of below condition relies on newPromoCodeDiscount
        to be initialized to zero in var declaration;
    */
    if (newPromoCode && newPromoCodeDiscount == 0) {
      showModal('<p>Sorry, <strong>' + newPromoCode + '</strong> is a valid promo code, but no discount could be applied with it.</p>')
    }

    if (newPromoCode && newPromoCodeDiscount > 0 && newPromoCodeDiscount <= existingPromoCodeDiscount) {
      showModal('<p>Sorry, no greater discount could be applied for promo code: ' + newPromoCode
            + '<br><br>' + existingPromoCode + ' discount is $' + existingPromoCodeDiscount.toFixed(2)
            + '<br><br>' + newPromoCode + ' discount would be $' + newPromoCodeDiscount.toFixed(2) + '</p>');
    }

    /* update cart summary fields */
    numCartItems = getCartItemsQuantity();
    for (var i=0; i<cartQuantitySpanArray.length; i++) {
      /* since we have the same number of all elements in cart summary to be
          updated, we will just use the length of cartQuantitySpanArray as
          the reference limit value for the loop;
      */
      if (numCartItems == 1) {
        cartQuantitySpanArray[i].innerHTML = numCartItems + ' item';
      } else {
        cartQuantitySpanArray[i].innerHTML = numCartItems + ' items';
      }

      cartSubtotalTdArray[i].innerHTML = '$' + cartSubtotal.toFixed(2);

      cartPromoCodeSpanArray[i].innerHTML = appliedPromoCode;

      cartPromoDiscountTdArray[i].innerHTML = '-$' + appliedPromoCodeDiscount.toFixed(2);

      cartTotalTdArray[i].innerHTML = '$' + cartTotal.toFixed(2);

      /* clear out promo code input field */
      /* NOTE: without using the slight delay to clear out the input field,
          a validation message would come up indicating that the field was empty;
          I assume this happened because the field was still in the 'submit' state
          since the delay remedied it; */
      setTimeout(clearInputValue(promoCodeInputArray[i]), 250);
      // promoCodeInputArray[i].value = '';
      // console.log('promoCodeInputArray[' + i + '].value =', promoCodeInputArray[i].value);

    } // end for

  } // end updateCartSummary

  function clearInputValue(inputElement) {
    return  function() {
              inputElement.value = '';
            };
  } // end clearInputValue

  function removeCartItem(cartItem) {

    var sku = cartItem.dataset.sku;
    var associatedListingItem = document.querySelector('.item-listing[data-sku="' + sku + '"]');
    var associatedListingItemQuantityInput = associatedListingItem.querySelector('.action-listing input.quantity');
    var associatedListingItemAddToCartButton = associatedListingItem.querySelector('button.add-to-cart');

    delete cartItems[sku];

    /* check cart and respond accordingly to total number of items,
        and also type of item(s) with regard to promo code; */
    checkCartItemsQuantity();

    /* update cart summary - must be left after checkCartItemsQuantity(); */
    updateCartSummary();

    /* reset the listing for this item with regard to:
        Quantity input value reset to 1,
        Quantity input enabled,
        "Item in cart" button text reset to "Add to cart",
        Add to cart button enabled
    */
    associatedListingItemQuantityInput.value = '1';
    associatedListingItemQuantityInput.disabled = false;

    associatedListingItemAddToCartButton.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Add to cart';
    associatedListingItemAddToCartButton.disabled = false;

    /* remove the cart item from the DOM */
    cartItem.parentElement.removeChild(cartItem);

  } // end function removeCartItem

  function _addListeners() {

    /* the following four listeners are for showing/hiding listing and cart
        with animation
        I chose to use them instead of the previous 2 (commented out below)
        so as to have a more gentle transition; */
    productListing.addEventListener('animationend', hideListShowCart, false);
    cartListing.addEventListener('animationend', hideCartShowList, false);
    /* set up event listeners for show cart buttons/widgets */
    showCartButtonInMain.addEventListener('click', hideProductListing, false);
    showCartButtonInListing.addEventListener('click', hideProductListing, false);

    // showCartButtonInMain.addEventListener('click', _showHide);
    /* this DOM element might normally be created dynamically when the listing
        page gets populated dynamically;
        in our case, it exists on initial page load, so we can reference it;
    */
    // showCartButtonInListing.addEventListener('click', _showHide);

    /* items previously in supercycles.js below */
    modalCloseAnchor.addEventListener('click', hideModal);
    promosAnchor.addEventListener('click', clickPromosAlert);
    /* items previously in supercycles.js above */

    /* listen for submit and click events in .listing-container */
    productListing.addEventListener('submit', _addToCartSubmit); // end productListing.addEventListener('submit', ...)

    productListing.addEventListener('click', function(event) {
      /* want to ignore clicking on "Add to cart" button which
          we should respond to with the submit event being triggered; */
      /* conversely, we want to ONLY respond to some other button if
          it exists, such as if I add a "Show Details/Hide Details"
          button; */
        /* get the button/element that was clicked */
    }); // end productListing.addEventListener('click', ...)

    cartListing.addEventListener('submit', _updateCartSubmit); // end cartListing.addEventListener('submit',...)

    cartListing.addEventListener('click', _cartButtonsClick); // end cartListing.addEventListener('click', ...)

  } // end _addListeners

  return {
    init: init
  };


})(); // end app.shopping = (function() {