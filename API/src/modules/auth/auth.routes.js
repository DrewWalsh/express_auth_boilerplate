import { Router } from "express";
import ExpressBrute from "express-brute";
import SequelizeStore from "express-brute-sequelize";
import db from "database/index";
import RegistrationPolicy from "./policies/register.policy";
import RegistrationController from "./controllers/register.controller";
import LoginPolicy from "./policies/login.policy";
import LoginController from "./controllers/login.controller";
import RefreshController from "./controllers/refresh.controller";

const router = Router();
new SequelizeStore(db, "registerBruteStoreMD", {}, function (store) {
	let bruteForce = new ExpressBrute(store, {
		freeRetries: 5,
		minWait: 300000,
		maxWait: 3600000,
	});
	router.post(
		"/auth/register",
		RegistrationPolicy.register,
		// bruteForce.prevent,
		RegistrationController.register
	);
});
new SequelizeStore(db, "loginBruteStoreMD", {}, function (store) {
	let bruteForce = new ExpressBrute(store, {
		freeRetries: 5,
		minWait: 300000,
		maxWait: 3600000,
	});
	router.post(
		"/auth/login",
		LoginPolicy.login,
		// bruteForce.prevent,
		LoginController.login
	);
});
router.post(
	"/auth/refresh",
	// verifyRefreshTokenPolicy.verifyRefreshToken,
	RefreshController.refreshAccessToken
);

module.exports = router;
