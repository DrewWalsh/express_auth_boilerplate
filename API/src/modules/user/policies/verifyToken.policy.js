import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	verifyToken(req, res, next) {
		const verifyTokenSchema = Joi.object().keys({
			//JWT token regex
			token: Joi.string()
				.regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
				.required(),
			Domain: Joi.string(),
			Path: Joi.string(),
			Expires: Joi.string(),
		});

		const { error } = verifyTokenSchema.validate(req.params);
		if (error) {
			console.log(error);
			if (
				error.details[0].type === "any.required" ||
				error.details[0].type === "string.pattern.base"
			) {
				return res.status(404).send({
					key: "ERR_INVALID_TOKEN",
					details: "Invalid Token",
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
