import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	changeUsername(req, res, next) {
		const changeUsernameSchema = Joi.object().keys({
			newUsername: Joi.string()
				.trim()
				//must start with letter and can contain, a-z, A-Z, 0-9 and _
				.pattern(/[a-zA-Z][a-zA-Z0-9-_]{2,32}/)
				.required(),
		});
		const { error, value } = changeUsernameSchema.validate(req.body);
		if (error) {
			if (error.details[0].context.key === "changeUsernameSchema") {
				if (!value.newUsername || value.newUsername.length === 0) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_USERNAME_EMPTY",
						details: "Please enter a new username",
					});
				} else if (
					error.details[0].message.includes("must be a valid username")
				) {
					return res.status(400).send({
						key: "ERR_USERNAME_INVALID",
						details: "Username invalid, Please enter a valid username",
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
