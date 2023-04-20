import { errorLogger } from "logger";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import config from "config";

const generateVerificationToken = (userId, type) => {
	try {
		const token = jwt.sign({ id: userId, type }, config.JWT_VERIFY_SECRET, {
			expiresIn: "24 hours",
		});
		return token;
	} catch (e) {
		errorLogger.error(e);
		return;
	}
};

const generateRefreshToken = async (userId) => {
	try {
		const token = jwt.sign({ id: userId }, config.JWT_AUTH_SECRET, {
			expiresIn: "60 days",
		});
		return token;
	} catch (e) {
		errorLogger.error(e);
		return;
	}
};
const generateAccessToken = async (refreshToken) => {
	try {
		//Get the user ID from the refresh token
		const validRefreshToken = jwt.verify(refreshToken, config.JWT_AUTH_SECRET);
		if (validRefreshToken) {
			//generate a new access token from the user ID
			const accessToken = jwt.sign(
				//id is the user ID that signed the refresh token
				{ id: validRefreshToken.id },
				config.JWT_AUTH_SECRET,
				{
					expiresIn: "2 hours",
				}
			);
			//associate the access token with the user.
			return accessToken;
		}
	} catch (e) {
		if (e.name == "TokenExpiredError") {
			return "ERR_TOKEN_EXPIRED";
		}
		return e;
	}
};

const authenticateLogin = async (email, password, User) => {
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw "ERR_INVALID_CREDENTIALS";
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw "ERR_INVALID_CREDENTIALS";
		}
		return user;
	} catch (e) {
		if (e === "ERR_INVALID_CREDENTIALS") {
			return e;
		} else {
			errorLogger.error(e);
		}
		return;
	}
};

module.exports = {
	generateVerificationToken,
	generateRefreshToken,
	generateAccessToken,
	authenticateLogin,
};
