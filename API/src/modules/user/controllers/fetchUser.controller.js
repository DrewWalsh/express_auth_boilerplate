import { errorLogger } from "logger";

module.exports = {
	async fetchUser(req, res) {
		try {
			res.status(200).send({
				success: true,
				user: {
					id: req.user.id,
					email: req.user.email,
					username: req.user.username,
					isVerified: req.user.isVerified,
					isDeleted: req.user.isDeleted,
				},
			});
		} catch (e) {
			errorLogger.error(e);
			return res.status(500).send({
				key: "ERR_UNKNOWN",
				details: "Unknown error",
			});
		}
	},
};
