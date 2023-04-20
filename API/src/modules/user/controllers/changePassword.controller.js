import { User } from "helpers/getModels";

import bcrypt from "bcrypt";

module.exports = {
	async changePassword(req, res) {
		try {
			const user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});
			if (user) {
				// if password matches confirm
				const isMatch = await bcrypt.compare(
					req.body.oldPassword,
					req.user.password
				);
				if (isMatch) {
					if (req.body.newPassword === req.body.newPasswordConfirm) {
						//change user password and save
						user.password = req.body.newPassword;
						await user.save();
						return res.status(200).send({
							success: true,
						});
					} else {
						throw "ERR_PASSWORD_MISMATCH";
					}
				}
				if (!isMatch) {
					throw "ERR_OLD_PASSWORD_INVALID";
				}
			} else {
				throw "ERR_USER_NOT_FOUND";
			}
		} catch (e) {
			if (e === "ERR_PASSWORD_MISMATCH") {
				return res.status(400).send({
					key: e,
					details:
						"Password fields do not match, please check your spelling and try again.",
				});
			} else if (e === "ERR_OLD_PASSWORD_INVALID") {
				return res.status(400).send({
					key: e,
					details: "Old password incorrect. Please reenter your password.",
				});
			} else if (e === "ERR_USER_NOT_FOUND") {
				//Unlikely to ever be triggered but handled just in case
				return res.status(404).send({
					key: "ERR_AUTHENTICATING",
					details:
						"Error authenticating user, please try logging back in and contact support if the problem persists.",
				});
			} else {
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "An unknown error has occurred",
				});
			}
		}
	},
};
