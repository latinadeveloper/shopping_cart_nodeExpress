module.exports = {
	db: { // credentials to log into database
		host:     'localhost',
		port: 		'27017',
		username: 'cs602_user',
		password: 'cs602_secret',
		database: 'cs602db'
	},
	session: {
		name: 'session',
		keys: ['supersecret']
	}
}
