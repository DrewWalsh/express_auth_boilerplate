import { User } from "helpers/getModels";
import { errorLogger } from "logger";
import bcrypt from "bcrypt";
import { sendDeactivateAccountEmail } from "modules/email/services/sendDeactivateAccountEmail.service";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import config from "config";

module.exports = {
	async sendDeactivateAccountEmail(req, res) {
		try {
			const user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});
			if (user) {
				const isMatch = await bcrypt.compare(
					req.body.password,
					req.user.password
				);
				if (isMatch) {
					const deleteAccountToken = await generateVerificationToken(
						req.user.id,
						"Deactivate User"
					);

					if (config.NODE_ENV === "production") {
						await sendDeactivateAccountEmail(req.user, deleteAccountToken);
					} else if (config.NODE_ENV === "development") {
						console.log(deleteAccountToken);
					}
					return res.status(200).send({
						success: true,
					});
				} else {
					throw "ERR_INVALID_CREDENTIALS";
				}
			} else {
				throw "ERR_USER_NOT_FOUND";
			}
		} catch (e) {
			if (e === "ERR_INVALID_CREDENTIALS") {
				return res.status(401).send({
					key: e,
					details: "Invalid Password",
				});
			} else if (e === "ERR_USER_NOT_FOUND") {
				return res.status(401).send({
					key: "ERR_AUTHENTICATING",
					details:
						"Error authenticating user, please try logging back in and contact support if the problem persists.",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		}
	},
};
