import { User } from "helpers/getModels";
import { errorLogger } from "logger";

const isActive = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				id: req.user.id,
			},
		});
		if (user) {
			if (user.isDeleted === true) {
				throw "ERR_ACCOUNT_DEACTIVATED";
			} else {
				next();
			}
		} else {
			throw new Error("ERR_USER_NOT_FOUND");
		}
	} catch (e) {
		if (e === "ERR_ACCOUNT_DEACTIVATED") {
			return res.status(401).send({
				key: e,
				details:
					"You recently deactivated your account, you must reactivate your account before you can do this",
			});
		} else if (e === "ERR_USER_NOT_FOUND") {
			return res.status(404).send({
				key: e,
				details: "No User found",
			});
		} else {
			errorLogger.error(e);
			return res.status(500).send({
				key: "ERR_UNKNOWN",
				details: "Unknown error",
			});
		}
	}
};

module.exports = isActive;
