const express = require('express');
const router = express.Router();
const Customer  = require('./customer/schema.js');
const Product = require('./product/schema.js');

router.get('/', (req , res , next) => {
  // https://gist.github.com/kdelemme/9659364
  // https://docs.mongodb.com/manual/reference/operator/aggregation
  Customer.aggregate([
    { $unwind: "$orders" },
    { $unwind: "$orders.items" },
    { $group: { _id: "$orders.items.product",
              total: { $sum: "$orders.items.quantity" },
              count: { $sum: 1 } } },
    { $sort: { total: -1 }},
    { $limit: 100 },
    { $lookup: { from: Product.collection.name,
                 localField: "_id",
                foreignField: "_id",
                as: "product" }},
    { $unwind: "$product" }
  ], (err, rankings) => {
      res.render('popular', { rankings: rankings })
  });
})

module.exports = router
