#Course 06 - Introduction to JavaScript and Modern Web Development

##Chapter 02 - Introduction to CSS, Project Assignment 6: Product Listing Page

###Product Listing Page, Part 1 - Build the UI

For Chapter 02 - Introduction to CSS, Project Assignment 6, Part 1, you will create a basic product listing page with a shopping cart at the bottom of the page. The product listing should display at least 10 different products with an Add to Cart button next to each. The shopping cart should display at least 3 products in the cart.

Each product must have a name, description, price, and a photo (placeholder photos are OK to use). For now, focus on creating an elegant shopping cart. Later, you will use JavaScript to add functionality.

Study one or more online shopping pages — such as Amazon.com — to explore the details and layouts companies often use for product listings and shopping carts.

Also include:

* A text input for entering a quantity, which should default to 1
* A Remove button for removing the product from the shopping cart
* An element, or set of elements, for displaying the total price of all products in the shopping cart.
* A promo code text input and button for adding coupons or promo codes (special codes that reduce the final price)
* A Keep Shopping button, with :hover and :active CSS variations.
* A Checkout button, for proceeding to the next step.

##Chapter 05 - Introduction to the DOM, Project Assignment 5: Product Listing Page Functionality

###Product Listing Page, Part 2 - Product Listing Page Functionality

Chapter 05 - Introduction to the DOM, As we discussed during the HTML and CSS chapters, here, you will add the JavaScript functionality to the projects you built for those chapters.

For this project assignment, you will focus on the shopping cart.

The shopping cart should have the following functionality to:

* Remain hidden until at least one item has been added

* Toggle between showing and hiding the shopping cart by using a button

* Add items to the shopping cart

* Remove items from the shopping cart

* Change the quantity of an item. A quantity of 0 will remove the item from the cart.

* Give a Total Price calculation that updates when items are added or removed. All prices should be kept within an object and referred to for each calculation.

* Allow coupons/promo codes on total prices as well as on individual items. Make up your own promo codes, such as “BIGSALE” or the like

  * Add a promo code for 10% off one item, 15% off all items of a specific type, and 5% off the total order

  * Only apply 1 promo code at a time

  * Only apply a promo code if it makes the total price less than the total price with the current promo code

[View the GitHub-hosted solution](https://rtstewart.github.io/shopping-cart/appModule-v2-supercycles.html)
