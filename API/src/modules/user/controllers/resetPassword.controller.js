import jwt from "jsonwebtoken";
import config from "config";
import { User } from "helpers/getModels";

module.exports = {
	async resetPassword(req, res) {
		try {
			const validPasswordResetToken = jwt.verify(
				req.params.token,
				config.JWT_VERIFY_SECRET
			);
			if (validPasswordResetToken.type !== "Reset Password") {
				throw "ERR_INVALID_TOKEN";
			}

			const user = await User.findOne({
				where: {
					id: validPasswordResetToken.id,
				},
			});
			if (validPasswordResetToken && user) {
				if (user.isDeleted === true) {
					throw "ERR_USER_DEACTIVATED";
				}
				if (req.body.password === req.body.passwordConfirm) {
					if (user.pendingPasswordReset === true) {
						user.password = req.body.password;
						user.pendingPasswordReset = false;
						await user.save();
						res.status(200).send({ success: true });
					} else {
						throw "ERR_INVALID_TOKEN";
					}
				} else {
					throw "ERR_PASSWORD_MISMATCH";
				}
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
						"Token no longer valid, please request another password reset",
				});
			} else if (e === "ERR_PASSWORD_MISMATCH") {
				return res.status(400).send({
					key: e,
					details:
						"Password fields do not match, please check your spelling and try again",
				});
			} else if (e === "ERR_USER_DEACTIVATED") {
				return res.status(401).send({
					key: e,
					details:
						"This account has been deactivated, you must reactivate before doing this",
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
