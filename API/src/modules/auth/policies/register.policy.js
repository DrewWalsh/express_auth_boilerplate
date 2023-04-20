import Joi from "joi";
import { errorLogger } from "logger";

module.exports = {
	register(req, res, next) {
		const registrationSchema = Joi.object().keys({
			username: Joi.string()
				.trim()
				//must start with letter and can contain, a-z, A-Z, 0-9 and _
				.pattern(/[a-zA-Z][a-zA-Z0-9-_]{2,32}/)
				.required(),
			email: Joi.string().email().max(320).lowercase().trim().required(),
			password: Joi.string()
				.trim()
				.pattern(
					/^(?=^.{8,128}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/
				)
				.required(),
			passwordConfirm: Joi.string().trim().required(),
		});
		const { error, value } = registrationSchema.validate(req.body);
		if (error) {
			//Email Error
			if (error.details[0].context.key === "email") {
				//Email Empty
				if (!value.email || value.email.length === 0) {
					res.status(400).send({
						key: "ERR_EMAIL_EMPTY",
						details: "Please enter an email address",
					});
					//Invalid email
				} else {
					res.status(400).send({
						key: "ERR_EMAIL_INVALID",
						details: "You must provide a valid email address",
					});
				}
			}
			//First Name Error
			else if (error.details[0].context.key === "username") {
				if (!value.username || value.username.length === 0) {
					res.status(400).send({
						key: "ERR_USERNAME_EMPTY",
						details: "Please enter a username",
					});
				} else {
					res.status(400).send({
						key: "ERR_username_INVALID",
						details: "Please enter a valid username",
					});
				}
			}

			//Password error
			else if (error.details[0].context.key === "password") {
				if (!value.password || value.password.length === 0) {
					//Password Empty
					res.status(400).send({
						key: "ERR_PASSWORD_EMPTY",
						details: "Please enter a password",
					});
				} else {
					//Password Invalid
					return res.status(400).send({
						key: "ERR_PASSWORD_FORMAT",
						details:
							"Your password must be between 8 and 128 characters and contain one lowercase letter, one uppercase letter, and one number",
					});
				}
			} else if (error.details[0].context.key === "passwordConfirm") {
				if (!value.passwordConfirm || value.passwordConfirm.length === 0) {
					//Password Empty
					res.status(400).send({
						key: "ERR_PASSWORD_CONFIRM_EMPTY",
						details: "Please re-enter your password",
					});
				} else if (value.passwordConfirm !== value.password) {
					return res.status(400).send({
						key: "ERR_PASSWORD_MISMATCH",
						details:
							"Password fields do not match, please check your spelling and try again",
					});
				}
			} else {
				res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		} else {
			next();
		}
	},
};
