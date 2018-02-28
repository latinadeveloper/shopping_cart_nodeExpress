const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connection = require('../dbConnection.js');

mongoose.Promise = global.Promise;

const productSchema = new Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	stock: {
		type: Number,
		min: 0,
		required: true
	},
	description: String,
	price: {
		type: Number,
		min: 0,
		required: true
	},
	color: String
});

/*module.exports = {  // taken out since there is only one connection
	getModel: (connection) => {
		return connection.model("ProductModel",
							productSchema);
	}
}*/

module.exports = connection.model("ProductModel", productSchema)
