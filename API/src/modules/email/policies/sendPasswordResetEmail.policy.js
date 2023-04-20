import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	sendPasswordResetEmail(req, res, next) {
		const sendPasswordResetEmailSchema = Joi.object().keys({
			email: Joi.string().email().trim().required(),
		});
		const { error, value } = sendPasswordResetEmailSchema.validate(req.body);
		if (error) {
			if (error.details[0].context.key === "email") {
				if (!value.email || value.email.length === 0) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_EMAIL_EMPTY",
						details: "Please enter an email address",
					});
				} else if (error.details[0].message.includes("must be a valid email")) {
					return res.status(400).send({
						key: "ERR_EMAIL_INVALID",
						details: "Email invalid, Please enter a valid email address",
					});
				} else {
					errorLogger.error(error);
					return res.status(500).send({
						key: "ERR_UNKNOWN",
						details: "Unknown error",
					});
				}
			}
		} else {
			next();
		}
	},
};
