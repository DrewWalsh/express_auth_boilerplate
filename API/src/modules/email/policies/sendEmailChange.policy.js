import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	sendEmailChange(req, res, next) {
		const sendEmailChangeSchema = Joi.object().keys({
			newEmail: Joi.string().email().max(320).lowercase().trim().required(),
		});
		const { error, value } = sendEmailChangeSchema.validate(req.body);
		if (error) {
			if (error.details[0].context.key === "newEmail") {
				if (!value.newEmail || value.newEmail.length === 0) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_EMAIL_EMPTY",
						details: "Please enter a new email address",
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
						details: "UNknown error",
					});
				}
			}
		} else {
			next();
		}
	},
};
