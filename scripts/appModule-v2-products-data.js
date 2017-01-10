app.productsData = (function() {

  /*

  The following illustrates the properties in a product object:

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

*/

/*

correct order of parameters for adding a product:

products.addProduct(
  sku
  , manufacturer
  , title
  , imageUri
  , description
  , category
  , discipline
  , groupset
  , price
  , salePrice
);

*/

/* NOTE: always use lower case for category since this will be assumed when
    checking promos of 'TYPE' byMethod against category values in products {}
*/

var searchResults = [

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ],

      [
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
      ]

    ];

  return searchResults;

})();