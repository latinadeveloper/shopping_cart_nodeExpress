const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../dbConnection.js');

mongoose.Promise = global.Promise;

const orderItem = new Schema({
	product: {
		type: Schema.ObjectId,
		ref: "ProductModel"
	},
	quantity: {
		type: Number,
		min: 1
	}
})

const customerSchema = new Schema({
	cart: [orderItem],
	orders: [{
		date: Date,
		items: [orderItem]
	}]
});

/*module.exports = {  // taken out since there is only one connection
	getModel: (connection) => {
		return connection.model("ProductModel",
							productSchema);
	}
}*/

module.exports = connection.model("CustomerModel", customerSchema)
