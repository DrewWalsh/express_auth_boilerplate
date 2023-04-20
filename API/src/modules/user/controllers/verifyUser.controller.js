import { errorLogger } from "logger";
import jwt from "jsonwebtoken";
import config from "config";
import { User } from "helpers/getModels";

module.exports = {
	async verifyUser(req, res) {
		try {
			const validVerificationToken = jwt.verify(
				req.params.token,
				config.JWT_VERIFY_SECRET
			);
			if (validVerificationToken.type !== "Verify User") {
				throw "ERR_INVALID_TOKEN";
			}
			const user = await User.findOne({
				where: {
					id: validVerificationToken.id,
				},
			});
			if (validVerificationToken && user) {
				if (user.isVerified === true) {
					throw "ERR_USER_ALREADY_VERIFIED";
				} else {
					user.isVerified = true;
					await user.save();
					res.status(200).send({
						success: true,
					});
				}
			}
		} catch (e) {
			if (e.name == "TokenExpiredError") {
				return res.status(401).send({
					key: "TOKEN_EXPIRED_ERROR",
					details:
						"Token no longer valid, please resend your verification email",
				});
			} else if (e === "ERR_INVALID_TOKEN" || e.name === "JsonWebTokenError") {
				res.status(404).send({
					key: "ERR_INVALID_TOKEN",
					details: "Invalid Token",
				});
			} else if (e === "ERR_USER_ALREADY_VERIFIED") {
				res.status(409).send({
					key: e,
					details: "User is already verified",
				});
			} else {
				errorLogger.error(e);
				//Unknown, but most likely an invalid token
				return res.status(404).send({
					key: "ERR_INVALID_TOKEN",
					details: "Invalid Token",
				});
			}
		}
	},
};
