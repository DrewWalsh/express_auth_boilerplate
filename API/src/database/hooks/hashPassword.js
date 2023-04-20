import bcrypt from "bcrypt";

const hashPassword = async (user) => {
	if (!user.changed("password")) {
		return;
	} else {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		user.set("password", hashedPassword);
		return;
	}
};

module.exports = hashPassword;
