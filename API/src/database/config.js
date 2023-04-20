require("dotenv").config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_USER_PASSWORD;
const host = "127.0.0.1";
const dialect = "postgres";
module.exports = {
	development: {
		database: process.env.DEV_DB_NAME,
		username,
		password,
		host,
		dialect,
	},
	test: {
		database: process.env.TEST_DB_NAME,
		username,
		password,
		host,
		dialect,
	},
	production: {
		database: process.env.PROD_DB_NAME,
		username,
		password,
		host,
		dialect,
	},
};
