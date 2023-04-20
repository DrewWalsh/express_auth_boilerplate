import { User } from "helpers/getModels";
import { errorLogger } from "logger";
import config from "config";

module.exports = {
	async login(req, res) {
		try {
			const { email, password } = req.body;
			//Verify login info match
			const user = await User.authenticateLogin(email, password);
			//generate auth tokens
			if (user.id) {
				const { refreshToken, accessToken } = await user.generateAuthTokens();
				if (config.NODE_ENV === "production") {
					res.cookie("refreshToken", refreshToken, {
						// domain: "https://puffycloud.website",
						path: "/",
						secure: true,
						// 60 days
						expires: new Date(Date.now() + 5184000000),
						httpOnly: true,
						sameSite: "strict",
					});
				} else {
					res.cookie("refreshToken", refreshToken, {
						path: "/",
						// 60 days
						expires: new Date(Date.now() + 5184000000),
						httpOnly: true,
						sameSite: "strict",
					});
				}
				return res.status(200).send({ success: true, accessToken });
			} else if (user === "ERR_INVALID_CREDENTIALS") {
				throw user;
			}
		} catch (e) {
			if (e === "ERR_INVALID_CREDENTIALS") {
				return res
					.status(401)
					.send({ key: e, details: "Invalid Email Address or Password" });
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown error",
				});
			}
		}
	},
};
