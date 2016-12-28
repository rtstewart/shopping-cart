app.main = (function(shopping, scrollThenFix) {

  function init() {
    scrollThenFix.init();
    shopping.init();
    console.log('app.main initialized');
  }

  return {
    init: init
  };

})(app.shopping, app.scrollThenFix);