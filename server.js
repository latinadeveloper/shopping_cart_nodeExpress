const express = require('express');
const app = express();

// calling in public folder
app.use(express.static('public'))

// setup handlebars view engine
const handlebars = require('express-handlebars');

app.engine('handlebars',
	handlebars({defaultLayout: 'main'}));

// Format currency and time
// https://formatjs.io/handlebars/
const Handlebars     = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(Handlebars);

app.set('view engine', 'handlebars');

// Don't cache cart
app.disable('etag');

// to parse request body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieSession = require('cookie-session')
const sessionInfo = require("./credentials.js").session;
app.use(cookieSession(sessionInfo));

// Routing
const productCustomerRoutes = require('./product/customer');
app.use('/products', productCustomerRoutes);

const cartRoutes = require('./customer/cart');
app.use('/cart', cartRoutes);

const productAdminRoutes = require('./product/admin');
app.use('/admin/products', productAdminRoutes);

const customerAdminRoutes = require('./customer/admin');
app.use('/admin/customers', customerAdminRoutes);

// Handles both /orders and /admin/customers/*/orders
const ordersRoutes = require('./customer/orders');
app.use('/', ordersRoutes);

const popularRoutes = require('./popular');
app.use('/popular', popularRoutes);

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use((req, res) => {
	res.status(404); // renders if no routes are found
	res.render('404');
});

app.listen(3000, () => {
  console.log('http://localhost:3000'); // logging the port is listening on
});
