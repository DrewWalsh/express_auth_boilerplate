import { errorLogger } from "logger";
import jwt from "jsonwebtoken";
import config from "config";
import { User } from "helpers/getModels";

module.exports = {
	async changeEmail(req, res) {
		try {
			//verify the token
			//set users new email to the pending email
			const validEmailChangeToken = jwt.verify(
				req.params.token,
				config.JWT_VERIFY_SECRET
			);
			if (validEmailChangeToken.type !== "Change Email") {
				throw "ERR_INVALID_TOKEN";
			}
			const user = await User.findOne({
				where: {
					id: validEmailChangeToken.id,
				},
			});
			if (validEmailChangeToken && user) {
				if (user.isDeleted === true) {
					throw "ERR_USER_DEACTIVATED";
				}
				if (user.pendingEmail) {
					user.email = user.pendingEmail;
					user.pendingEmail = null;
					if (user.isVerified === false) {
						user.isVerified = true;
					}
					await user.save();
					res.status(200).send({ success: true });
				} else {
					throw "ERR_UNEXPECTED";
				}
			} else {
				throw "ERR_INVALID_TOKEN";
			}
		} catch (e) {
			if (e === "ERR_INVALID_TOKEN" || e.name === "JsonWebTokenError") {
				return res.status(404).send({
					key: "ERR_INVALID_TOKEN",
					detais: "Invalid Token",
				});
			} else if (e.name == "TokenExpiredError") {
				return res.status(401).send({
					key: "TOKEN_EXPIRED_ERROR",
					details:
						"Token no longer valid, please resend your email change request",
				});
			} else if (e === "ERR_USER_DEACTIVATED") {
				return res.status(401).send({
					key: e,
					details:
						"This account has been deactivated, you must reactivate before doing this",
				});
			} else if (e === "ERR_UNEXPECTED") {
				//Pending email missing from user column
				return res.status(409).send({
					key: e,
					details:
						"An unexpected error has occurred, please resubmit the email change request",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "An unknown error occurred",
				});
			}
		}
	},
};
