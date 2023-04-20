import Sequelize from "sequelize";
import config from "config";
import dbConfig from "database/config";
let db;
let databaseName;
if (config.NODE_ENV === "development") {
	databaseName = dbConfig.development.database;
} else if (config.NODE_ENV === "production") {
	databaseName = dbConfig.production.database;
} else if (config.NODE_ENV === "test") {
	databaseName = dbConfig.test.database;
}

db = new Sequelize(databaseName, undefined, undefined, {
	host: "/var/run/postgresql",
	dialect: "postgres",
	logging: false,
});
//STANDARD CONFIG
if (config.NODE_ENV === "development" || config.NODE_ENV === "production") {
	db.authenticate()
		.then(() => console.log("Database Connected"))
		.catch((err) => console.log("Error: " + err));
	db.sync({ force: false, logging: false });
}
//TEST CONFIG
else if (config.NODE_ENV === "test") {
	db.authenticate().catch((err) => console.log("Error: " + err));
}
module.exports = db;
