import { User } from "helpers/getModels";
import { errorLogger } from "logger";

const isVerified = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				id: req.user.id,
			},
		});
		if (user) {
			if (user.isVerified === true) {
				next();
			} else {
				throw "ERR_ACCOUNT_UNVERIFIED";
			}
		} else {
			throw new Error("ERR_USER_NOT_FOUND");
		}
	} catch (e) {
		if (e === "ERR_ACCOUNT_UNVERIFIED") {
			return res.status(401).send({
				key: e,
				details: "Please verify your email",
			});
		} else if (e === "ERR_USER_NOT_FOUND") {
			return res.status(404).send({
				key: e,
				details: "No User found",
			});
		} else {
			errorLogger.error("isVerified:");
			errorLogger.error(e);
			return res.status(500).send({
				key: "ERR_UNKNOWN",
				details: "Unknown error",
			});
		}
	}
};

module.exports = isVerified;
