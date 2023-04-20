import { sendPasswordResetEmail } from "modules/email/services/sendPasswordResetEmail.service";
import { User } from "helpers/getModels";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import config from "config";
import { errorLogger } from "logger";

module.exports = {
	async sendPasswordResetEmail(req, res) {
		try {
			let user = await User.findOne({
				where: {
					email: req.body.email,
					isVerified: true,
				},
			});

			if (user) {
				const passwordResetToken = generateVerificationToken(
					user.id,
					"Reset Password"
				);
				user.pendingPasswordReset = true;
				await user.save();
				if (config.NODE_ENV === "production") {
					await sendPasswordResetEmail(user, passwordResetToken);
				} else if (config.NODE_ENV === "development") {
					console.log(passwordResetToken);
				}
			}
			//Should send the same response regardless of if the email has an account or not
			res.status(200).send({
				success: true,
			});
		} catch (e) {
			if (e === "ERR_UNKNOWN") {
				errorLogger.error(e);
				return res.status(500).send({
					key: e,
					details: "An unknown error has occurred",
				});
			}
			//
		}
	},
};
