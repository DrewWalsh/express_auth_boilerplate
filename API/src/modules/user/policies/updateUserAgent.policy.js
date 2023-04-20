import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	updateUserAgent(req, res, next) {
		const updateUserAgentSchema = Joi.object().keys({
			userAgent: Joi.string()
				.trim()
				//must start with letter and can contain, a-z, A-Z, 0-9 and _
				.pattern(/[a-zA-Z][a-zA-Z0-9-_]/)
				.required(),
		});
		const { error, value } = updateUserAgentSchema.validate(req.body);
		if (error) {
			errorLogger.error("Update User Agent Policy:");
			errorLogger.error(error);
			return res.status(500).send({
				key: "ERR_UNKNOWN",
				details: "UNknown error",
			});
		} else {
			req.body.userAgent = req.body.userAgent.substring(0, 250);
			next();
		}
	},
};
