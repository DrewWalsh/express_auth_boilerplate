import { errorLogger } from "logger";
import { User } from "helpers/getModels";

module.exports = {
	async updateUserAgent(req, res) {
		try {
			const user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});
			if (user && req.body.userAgent && req.body.userAgent.length > 0) {
				user.userAgent = req.body.userAgent;
				await user.save();
			}
			res.status(200).send({
				success: true,
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
