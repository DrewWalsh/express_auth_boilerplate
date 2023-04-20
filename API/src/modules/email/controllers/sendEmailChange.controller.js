import { generateVerificationToken } from "modules/auth/auth.helpers";
import { sendEmailChange } from "modules/email/services/sendEmailChange.service";
import { User } from "helpers/getModels";
import config from "config";
import { errorLogger } from "logger";

module.exports = {
	async sendEmailChange(req, res) {
		try {
			if (req.user.email === req.body.newEmail) {
				throw "ERR_CURRENT_EMAIL";
			}
			const user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});

			user.pendingEmail = req.body.newEmail;
			await user.save();
			const emailChangeToken = await generateVerificationToken(
				req.user.id,
				"Change Email"
			);

			//CHANGE TO SEND EMAIL CHANGE SERVICE
			if (config.NODE_ENV === "production") {
				await sendEmailChange(req.user, emailChangeToken);
			} else if (config.NODE_ENV === "development") {
				console.log(emailChangeToken);
			}
			return res.status(200).send({ success: true });
		} catch (e) {
			if (e === "ERR_CURRENT_EMAIL") {
				return res.status(409).send({
					key: e,
					details: "This is already your current email address",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "An unknown error has occurred",
				});
			}
		}
	},
};
