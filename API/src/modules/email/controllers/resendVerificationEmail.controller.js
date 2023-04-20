import { generateVerificationToken } from "modules/auth/auth.helpers";
import { sendVerificationEmail } from "modules/email/services/sendVerificationEmail.service";
import config from "config";
import { errorLogger } from "logger";

module.exports = {
	async resendVerificationEmail(req, res) {
		try {
			//this route should only work if you are not verified OR you have a pending new email
			if (req.user.isVerified === false) {
				const emailVerificationToken = await generateVerificationToken(
					req.user.id,
					"Verify User"
				);
				if (config.NODE_ENV === "production") {
					await sendVerificationEmail(req.user, emailVerificationToken);
				} else if (config.NODE_ENV === "development") {
					console.log(emailVerificationToken);
				}
				res.status(200).send({
					success: true,
				});
			} else {
				throw "ERR_USER_ALREADY_VERIFIED";
			}
		} catch (e) {
			if (e === "ERR_USER_ALREADY_VERIFIED") {
				return res.status(409).send({
					key: e,
					details: "Your email address has already been verified",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "UNKNOWN_ERROR",
					details: "An unknown error has occurred",
				});
			}
		}
	},
};
