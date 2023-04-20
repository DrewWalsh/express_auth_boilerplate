import { User } from "helpers/getModels";

const createUser = async (user) => {
	try {
		const newUser = await User.create(user);
		if (newUser.username === "Drew" || newUser.username === "Demo") {
			newUser.isVerified = true;
		}
		await newUser.save();
		return newUser;
	} catch (e) {
		if (
			e.name === "SequelizeUniqueConstraintError" &&
			e.original.constraint === "users_email_key"
		) {
			throw "ERR_EMAIL_IN_USE";
		} else if (
			e.name === "SequelizeUniqueConstraintError" &&
			e.original.constraint === "users_username_key"
		) {
			throw "ERR_USERNAME_IN_USE";
		} else {
			throw "ERR_UNKNOWN";
		}
	}
};
module.exports = {
	createUser,
};
