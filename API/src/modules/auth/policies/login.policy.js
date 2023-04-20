import Joi from "joi";

module.exports = {
	//=====Login=====
	login(req, res, next) {
		const loginSchema = Joi.object().keys({
			email: Joi.string().email().lowercase().required().trim(),
			password: Joi.string().min(1).required().trim(),
		});

		const { error, value } = loginSchema.validate(req.body);
		if (error) {
			//Email error
			if (!value.email) {
				return res.status(400).send({
					key: "ERR_EMAIL_EMPTY",
					details: "Please enter an email address",
				});
			} else if (error.details[0].context.key === "email") {
				res.status(400).send({
					key: "ERR_INVALID_EMAIL",
					details: "You must provide a valid email address",
				});
			}
			//Password error
			else if (error.details[0].context.key === "password") {
				res.status(400).send({
					key: "ERR_PASSWORD_EMPTY",
					details: "Please enter a password",
				});
			}
		} else {
			//Success
			next();
		}
	},
};
