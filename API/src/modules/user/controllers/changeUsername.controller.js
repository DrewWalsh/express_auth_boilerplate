import { errorLogger } from "logger";
import { User } from "helpers/getModels";

module.exports = {
	async changeUsername(req, res) {
		try {
			let user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});

			if (user) {
				const usernameInUse = await User.findOne({
					where: {
						username: req.body.newUsername,
					},
				});
				if (usernameInUse) {
					throw "ERR_USERNAME_IN_USE";
				} else {
					user.username = req.body.newUsername;
					await user.save();
					return res.status(200).send({
						success: true,
					});
				}
			} else {
				throw "ERR_NOT_FOUND";
			}
		} catch (e) {
			if (e === "ERR_USERNAME_IN_USE") {
				return res.status(409).send({
					key: e,
					details: "That username is already in use",
				});
			} else if (e === "ERR_USER_DEACTIVATED") {
				return res.status(401).send({
					key: e,
					details:
						"This account has been deactivated, you must reactivate before doing this",
				});
			} else if (e === "ERR_NOT_FOUND") {
				return res.status(404).send({
					key: e,
					details: "User not found",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "An unknown error occurred",
				});
			}
		}
	},
};
