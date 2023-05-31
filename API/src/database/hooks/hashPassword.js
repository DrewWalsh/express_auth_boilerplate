import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (user) => {
	if (!user.changed("password")) {
		return;
	}

	try {
		const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
		user.set("password", hashedPassword);
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Failed to hash password");
	}
};

export default hashPassword;
