const express = require('express');
const router = express.Router();
const Customer  = require('./schema.js');
const Product = require('../product/schema.js');
const doTotal = require('./total.js');

router.post('/orders', (req , res , next) => {  // saves the changes after the edit is made
  const customerId = req.session.customerId;

  Customer.findById(customerId, (err, customer) => {
    const cart = customer.cart;
    cart.forEach((item) => {
      console.log("Dec Item " + item.quantity );
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, (err, product) => {
        if (err)
          console.log("Error Stock : %s ", err);
      });
    });

    customer.cart = [];
    customer.orders.push({ date: Date(), items: cart });
    customer.save((err) => {
      if(err)
        console.log("Error Saving Customer : %s ", err);
      else
        res.redirect('/orders/' + (customer.orders.length - 1));
    });
  });

  //res.redirect('/cart');
})

listOrders = (admin) => {
  return (req , res , next) => {
    const customerId = req.params.customerId || req.session.customerId;

    Customer.findById(customerId).populate('orders.items.product').exec((err, customer) => {
      if (customer && customer.orders && customer.orders.length > 0) {
        const orders = customer.orders;
        orders.forEach((order, index) => {
          order.orderId = index;
          order.total = doTotal(order.items);
        });
        res.render('customer/orders/index', { items: orders, customerId: customerId, admin: admin })
      } else {
        res.render('customer/cart_empty')
      }
    });
  }
}
router.get('/orders/', listOrders(false));
router.get('/admin/customers/:customerId/orders', listOrders(true));

showOrder = (req , res , next) => {
  const customerId = req.params.customerId || req.session.customerId;
  const orderId = parseInt(req.params.id);

  Customer.findById(customerId).populate('orders.items.product').exec((err, customer) => {
    const order = customer.orders[orderId];
    order.total = doTotal(order.items);
    order.orderId = orderId;
    res.render('customer/orders/show', order)
  });
}
router.get('/orders/:id', showOrder)
//router.get('/admin/customers/:customerId/orders/:id', showOrder);

router.get('/admin/customers/:customerId/orders/:id/delete', (req , res , next) => {
  const customerId = req.params.customerId;
  const orderId = parseInt(req.params.id);
    console.log(`Delete: ${orderId} for ${customerId}`)

  Customer.findById(customerId).populate('orders.items.product').exec((err, customer) => {
    if(err)	// handles errors
      console.log("Error Selecting : %s ", err);
    else {
      customer.orders.splice(orderId, 1);
      customer.save((err) => {
        if(err)
          console.log("Error Saving Customer : %s ", err);
        else
          res.redirect('/admin/customers/' + customerId + '/orders/');
      });
    }
  });
})

module.exports = router;
