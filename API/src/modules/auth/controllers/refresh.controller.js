import { generateAccessToken } from "modules/auth/auth.helpers.js";
import { errorLogger } from "logger";
import jwt from "jsonwebtoken";
import config from "config";
import { User } from "helpers/getModels";

module.exports = {
	async refreshAccessToken(req, res) {
		try {
			//Route called when ERR_TOKEN_EXPIRED
			//is received from isAuthenticated middleware
			//Takes refresh token from cookie
			//uses that token to create a new access token
			if (req.cookies.refreshToken) {
				const validRefreshToken = jwt.verify(
					req.cookies.refreshToken,
					config.JWT_AUTH_SECRET
				);

				const user = await User.findOne({
					where: {
						id: validRefreshToken.id,
					},
				});
				if (validRefreshToken && user) {
					const accessToken = await generateAccessToken(
						req.cookies.refreshToken
					);
					res.status(200).send({ success: true, accessToken });
				} else {
					throw "ERR_SESSION_EXPIRED";
				}
			} else {
				throw "ERR_SESSION_EXPIRED";
			}
		} catch (e) {
			if (
				e == "ERR_SESSION_EXPIRED" ||
				e.name === "TokenExpiredError" ||
				e.name === "JsonWebTokenError"
			) {
				//Refresh token has expird and user must log back in
				return res.status(401).send({
					key: "ERR_SESSION_EXPIRED",
					details: "Your session has expired",
				});
			} else {
				errorLogger.error(e);
				return res.status(500).send({
					key: "ERR_UNKNOWN",
					details: "Unknown Error",
				});
			}
		}
	},
};
