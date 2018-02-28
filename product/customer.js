const express = require('express');
const router = express.Router();
const Product  = require('./schema.js');
const search = require('./search.js');

router.get('/', search('product/customer/index'));

router.get('/:id', (req , res , next) => {  // saves the changes after the edit is made
  let id = req.params.id;

  Product.findById(id, (err, product) => {
    if(err)
      console.log("Error Selecting : %s ", err);
    if (!product)
      return res.render('404');

    res.render('product/customer/show',
        {title:"Show Product",
         hasStock: product.stock > 0,
         data: {id: product._id,
                name: product.name,
                stock: product.stock,
                description: product.description,
                price: product.price,
                color: product.color
               }
        });
  });
})

module.exports = router; // exports routes
