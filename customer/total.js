

module.exports = (items) => {
  return items.reduce((acc, item) => {
    if (item.product){
    item.totalPrice = item.product.price * item.quantity;
    return acc + item.totalPrice;
    }
    else{
      return acc;
    }
  }, 0);

}
