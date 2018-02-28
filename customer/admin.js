const express = require('express');
const router = express.Router();
const Customer  = require('./schema.js');
const doTotal = require('./total.js');

router.get('/', (req , res , next) => {
  Customer.find({}, (err, customers) => {
    res.render('customer/admin/index', { customers: customers })
  });
})

showOrder = (req , res , next) => {
  const customerId = req.params.customerId;
  const orderId = parseInt(req.params.id);

  Customer.findById(customerId).populate('orders.items.product').exec((err, customer) => {
    const order = customer.orders[orderId];
    order.total = doTotal(order.items);
    order.orderId = orderId;
    order.customerId = customerId;
    res.render('customer/admin/show', order)
  });
}
router.get('/:customerId/orders/:id', showOrder);

// https://www.npmjs.com/package/qs#parsing-objects
// quantity[XXX] becomes { "quantity": "XXX"}
router.post('/:customerId/orders/:id/update', (req , res , next) => {
  const customerId = req.params.customerId;
  const orderId = parseInt(req.params.id);

  Customer.findById(customerId, (err, customer) => { // lookup Customer
    //console.log(req.body.quantity);
    //console.log(customer.orders);
    const order = customer.orders[orderId];
    for (const productId in req.body.quantity) {
      const quantity = parseInt(req.body.quantity[productId]);
      if (quantity == 0) {
        customer.orders[orderId].items = order.items.filter((item) => item.product != productId); // keeping everything we are not removing
      } else {
        const orderItem = order.items.find((item) => item.product == productId);
        if (orderItem)
          orderItem.quantity = quantity;
      }
    }

    customer.save((err) => {
      if(err)
        console.log("Error saving : %s ", err);
    });
  });

  res.redirect('/admin/customers/' + customerId + '/orders/' + orderId);
})

module.exports = router; // exports routes
