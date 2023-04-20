import Joi from "joi";

module.exports = {
	changePassword(req, res, next) {
		const changePasswordSchema = Joi.object().keys({
			oldPassword: Joi.string().max(128).required().trim(),
			newPassword: Joi.string()
				.pattern(
					/^(?=^.{8,128}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/
				)
				.required()
				.trim(),
			newPasswordConfirm: Joi.string().required().trim(),
		});
		const { error, value } = changePasswordSchema.validate(req.body);
		if (error) {
			if (error.details[0].context.key === "oldPassword") {
				if (
					error.details[0].context.value === null ||
					error.details[0].context.value === ""
				) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_BLANK_OLD_PASSWORD",
						details: "Please enter your current password",
					});
				} else if (value.password.length > 128) {
					return res.status(400).send({
						key: "ERR_INVALID_CREDENTIALS",
						details: "Invalid Old Password",
					});
				}
			}
			//Password error
			else if (error.details[0].context.key === "newPassword") {
				if (
					error.details[0].context.value === null ||
					error.details[0].context.value === ""
				) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_BLANK_NEW_PASSWORD",
						details: "Please enter your new password",
					});
				} else {
					//Password Invalid
					return res.status(400).send({
						key: "ERR_PASSWORD_FORMAT",
						details: `Your password must be between 8 and 128 characters and contain
							one lowercase letter, one uppercase letter, and one number`,
					});
				}
			} else if (error.details[0].context.key === "newPasswordConfirm") {
				if (
					error.details[0].context.value === null ||
					error.details[0].context.value === ""
				) {
					//Password Empty
					return res.status(400).send({
						key: "ERR_BLANK_NEW_PASSWORD_CONFIRM",
						details: "Please reenter your new password",
					});
				} else if (value.newPasswordConfirm !== value.newPassword) {
					return res.status(400).send({
						key: "ERR_PASSWORD_MISMATCH",
						details:
							"Password fields do not match, please check your spelling and try again",
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
