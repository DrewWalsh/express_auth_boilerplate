import Joi from "joi";
import { errorLogger } from "logger";
//Refresh Token is sent via cookie and requires a seperate policy from the other tokens
module.exports = {
	verifyRefreshToken(req, res, next) {
		const verifyRefreshTokenSchema = Joi.object().keys({
			//JWT token regex
			refreshToken: Joi.string()
				.regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
				.required(),
			Domain: Joi.string(),
			Path: Joi.string(),
			Expires: Joi.string(),
		});

		const { error } = verifyRefreshTokenSchema.validate(req.cookies);
		if (error) {
			if (
				error.details[0].type === "any.required" ||
				error.details[0].type === "string.pattern.base"
			) {
				return res.status(404).send({
					key: "ERR_SESSION_EXPIRED",
					details: "Your session has expired",
				});
			} else {
				errorLogger.error(error);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		} else {
			//Success
			next();
		}
	},
};
