import jwt from "jsonwebtoken";
import { User } from "helpers/getModels";
import config from "config";
import { errorLogger } from "logger";

const auth = async (req, res, next) => {
	try {
		if (req.header("Authorization")) {
			//=====Get JWT Token from Client Header=====
			const accessToken = req.header("Authorization").replace("Bearer ", "");

			//=====Decode JWT Token=====
			const decoded = jwt.verify(accessToken, config.JWT_AUTH_SECRET);
			//=====Checks For User With Matching Token=====
			const user = await User.findOne({
				where: {
					id: decoded.id,
				},
			});
			if (user) {
				req.user = user;
				req.accessToken = accessToken;
				next();
			} else {
				throw "ERR_NOT_AUTHENTICATED";
			}
		} else {
			throw "ERR_NOT_AUTHENTICATED";
		}
	} catch (e) {
		console.log(e);
		if (e.name == "TokenExpiredError") {
			//if this error is recieved on the front end, call refresh route
			return res.status(403).send({
				key: "ERR_TOKEN_EXPIRED",
				details: "Your session has expired",
			});
		} else if (e === "ERR_NOT_AUTHENTICATED" || e.name == "JsonWebTokenError") {
			return res.status(403).send({
				key: "ERR_NOT_AUTHENTICATED",
				details: "You must be logged in to do that",
			});
		} else {
			errorLogger.error("isAuthenticated.js:");
			errorLogger.error(e);
		}
	}
};

module.exports = auth;
