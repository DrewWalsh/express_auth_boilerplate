import Joi from "joi";

module.exports = {
	sendDeactivateAccountEmail(req, res, next) {
		const sendDeactivateAccountEmailSchema = Joi.object().keys({
			password: Joi.string().max(128).required().trim(),
		});
		const { error, value } = sendDeactivateAccountEmailSchema.validate(
			req.body
		);
		if (error) {
			if (error.details[0].context.key === "password") {
				if (!value.password || value.password.length == 0) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_EMPTY_PASSWORD",
						details: "Please enter your password",
					});
				} else if (value.password.length > 128) {
					return res.status(400).send({
						key: "ERR_INVALID_CREDENTIALS",
						details: "Invalid Password",
					});
				}
			} else {
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		} else {
			next();
		}
	},
};
