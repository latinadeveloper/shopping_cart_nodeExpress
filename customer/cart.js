const express = require('express');
const router = express.Router();
const Customer  = require('./schema.js');
const doTotal = require('./total.js');

router.post('/', (req , res , next) => {  // saves the changes after the edit is made
  const productId = req.body.productId;
  const quantity = parseInt(req.body.quantity); // keeping it an integer
  let customerId = req.session.customerId;
  if (customerId) {
    Customer.findById(customerId, (err, customer) => { // lookup Customer
      // Lookup existing cart item, if it exists update the quantity otherwise create new item
      let orderItem = customer.cart.find((item) => item.product == productId);
      if (orderItem)
        orderItem.quantity += quantity; // Update existing item quantity
      else {
        orderItem = { product: productId, quantity: quantity };
        customer.cart.push(orderItem);
      }

      customer.save((err) => {
        if(err)
          console.log("Error saving : %s ", err);
      });
    });
  } else {
    // Create new customer
    const orderItem = { product: productId, quantity: quantity };
    let customer = new Customer({
      cart: [orderItem],
      orders: [],
    });
    customer.save((err) => {
      if(err)
        console.log("Error saving : %s ", err);
    });
    console.log("Created Customer: " + customer._id);
    req.session.customerId = customer._id;
  }

  res.redirect('/cart');
})

// https://www.npmjs.com/package/qs#parsing-objects
// quantity[XXX] becomes { "quantity": "XXX"}
router.post('/update', (req , res , next) => {
  let customerId = req.session.customerId;

  Customer.findById(customerId, (err, customer) => { // lookup Customer
    console.log(req.body.quantity);
    for (const productId in req.body.quantity) {
      const quantity = parseInt(req.body.quantity[productId]);
      if (quantity == 0) {
        customer.cart = customer.cart.filter((item) => item.product != productId); // keeping everything we are not removing
      } else {
        const orderItem = customer.cart.find((item) => item.product == productId);
        if (orderItem)
          orderItem.quantity = quantity;
      }
    }

    customer.save((err) => {
      if(err)
        console.log("Error saving : %s ", err);
    });
  });

  res.redirect('/cart');
})

router.get('/', (req , res , next) => {
  let customerId = req.session.customerId;

  Customer.findById(customerId).populate('cart.product').exec((err, customer) => {
    if (customer && customer.cart && customer.cart.length > 0) {
      const cart = customer.cart;
      const total = doTotal(cart);
      res.render('customer/cart', { total: total, items: customer.cart })
    } else {
      res.render('customer/cart_empty')
    }
  });
})

module.exports = router; // exports routes
