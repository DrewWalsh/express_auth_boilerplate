import { User } from "helpers/getModels";

module.exports = {
	async reactivateAccount(req, res) {
		try {
			const user = await User.findOne({
				where: {
					id: req.user.id,
				},
			});

			if (user && user.isDeleted === true && user.email) {
				user.isDeleted = false;
				await user.save();
				return res.status(200).send({
					success: true,
				});
			} else {
				throw "ERR_NOT_FOUND";
			}
		} catch (e) {
			if (e === "ERR_NOT_FOUND") {
				return res.status(404).send();
			} else {
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		}
	},
};
