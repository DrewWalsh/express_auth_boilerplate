import { User } from "helpers/getModels";
import { errorLogger } from "logger";
import jwt from "jsonwebtoken";
import config from "config";

module.exports = {
	async deactivateAccount(req, res) {
		try {
			const validDeactivateUserToken = jwt.verify(
				req.params.token,
				config.JWT_VERIFY_SECRET
			);
			if (validDeactivateUserToken.type !== "Deactivate User") {
				throw "ERR_INVALID_TOKEN";
			}
			let user = await User.findOne({
				where: {
					id: validDeactivateUserToken.id,
				},
			});
			if (validDeactivateUserToken && user) {
				if (user.isDeleted === true) {
					throw "ERR_USER_ALREADY_DEACTIVATED";
				}
				user.isDeleted = true;
				await user.save();
				return res.status(200).send({
					success: true,
				});
			} else {
				throw "ERR_INVALID_TOKEN";
			}
		} catch (e) {
			if (e === "ERR_INVALID_TOKEN" || e.name === "JsonWebTokenError") {
				return res.status(404).send({
					key: e,
					details: "Invalid Token",
				});
			} else if (e.name == "TokenExpiredError") {
				return res.status(401).send({
					key: "TOKEN_EXPIRED_ERROR",
					details:
						"Token no longer valid, please request another account deactivation",
				});
			} else if (e === "ERR_USER_ALREADY_DEACTIVATED") {
				return res.status(409).send({
					key: e,
					details: "This account has already been deactivated.",
				});
			} else {
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		}
	},
};
