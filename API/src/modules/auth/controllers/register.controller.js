import fs from "fs";
import path from "path";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import { createUser } from "modules/auth/services/createUser.service";
import { sendVerificationEmail } from "modules/email/services/sendVerificationEmail.service";
import { errorLogger } from "logger";
import config from "config";

module.exports = {
	async register(req, res) {
		try {
			let user = req.body;
			if (user.password !== user.passwordConfirm) {
				throw "ERR_PASSWORD_MISMATCH";
			}

			const newUser = await createUser(user);

			const emailVerificationToken = await generateVerificationToken(
				newUser.id,
				"Verify User"
			);

			if (config.NODE_ENV === "production") {
				await sendVerificationEmail(newUser, emailVerificationToken);
			} else if (config.NODE_ENV === "development") {
				console.log(emailVerificationToken);
			}

			const { refreshToken, accessToken } = await newUser.generateAuthTokens();
			//Send refresh token as httpOnly cookie
			if (config.NODE_ENV === "production") {
				res.cookie("refreshToken", refreshToken, {
					path: "/",
					secure: true,
					// 60 days
					expires: new Date(Date.now() + 2678400000),
					httpOnly: true,
					sameSite: "strict",
				});
			} else {
				res.cookie("refreshToken", refreshToken, {
					// // 60 days
					expires: new Date(Date.now() + 2678400000),
					httpOnly: true,
					sameSite: "strict",
				});
			}

			//return accessToken to user to be stored on client
			return res.status(201).send({ success: true, accessToken });
		} catch (e) {
			if (e === "ERR_PASSWORD_MISMATCH") {
				return res.status(400).send({
					key: e,
					details:
						"Password fields do not match, please check your spelling and try again",
				});
			}
			//DUPLICATE EMAIL
			else if (e === "ERR_EMAIL_IN_USE") {
				return res.status(409).send({
					key: e,
					details: "There is already an account with that email",
				});
			} else if (e === "ERR_USERNAME_IN_USE") {
				return res.status(409).send({
					key: e,
					details: "There is already an account with that username",
				});
			} else if (e === "ERR_INVALID_ACCESS_CODE") {
				return res.status(401).send({
					key: e,
					details: "Invalid access code",
				});
			} else {
				errorLogger.error(
					"An unknown error has occurred in register.controller"
				);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "An unknown error has occurred",
				});
			}
		}
	},
};
