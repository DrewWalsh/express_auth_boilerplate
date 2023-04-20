import db from "database";
import "database/models/index/User";

const models = {
	User: db.model("user"),
};

module.exports = models;
