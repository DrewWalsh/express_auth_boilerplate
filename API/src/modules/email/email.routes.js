import { Router } from "express";
import ExpressBrute from "express-brute";
import SequelizeStore from "express-brute-sequelize";
import db from "database/index";
import isAuthenticated from "middleware/isAuthenticated";
import isActive from "middleware/isActive";
import SendEmailChangeController from "modules/email/controllers/sendEmailChange.controller";
import ResendVerificationEmailController from "modules/email/controllers/resendVerificationEmail.controller";
import SendPasswordResetEmailController from "modules/email/controllers/sendPasswordResetEmail.controller";
import SendDeactivateAccountEmailController from "modules/email/controllers/sendDeactivateAccountEmail.controller";
import SendDeactivateAccountEmailPolicy from "modules/email/policies/sendDeactivateAccountEmail.policy";
import SendEmailChangePolicy from "modules/email/policies/sendEmailChange.policy";
import SendPasswordResetEmailPolicy from "modules/email/policies/sendPasswordResetEmail.policy";

const router = Router();

new SequelizeStore(db, "emailBruteStoreMD", {}, function (store) {
	let bruteForce = new ExpressBrute(store, {
		freeRetries: 10,
		minWait: 300000,
		maxWait: 3600000,
	});

	router.post(
		"/email/send-email-change",
		isAuthenticated,
		SendEmailChangePolicy.sendEmailChange,
		bruteForce.prevent,
		isActive,
		SendEmailChangeController.sendEmailChange
	);
	router.post(
		"/email/send-password-reset",
		SendPasswordResetEmailPolicy.sendPasswordResetEmail,
		bruteForce.prevent,
		SendPasswordResetEmailController.sendPasswordResetEmail
	);
	router.post(
		"/email/resend-verification-email",
		isAuthenticated,
		bruteForce.prevent,
		isActive,
		ResendVerificationEmailController.resendVerificationEmail
	);
	router.post(
		"/email/send-deactivate-account",
		isAuthenticated,
		SendDeactivateAccountEmailPolicy.sendDeactivateAccountEmail,
		// bruteForce.prevent,
		// isActive,
		SendDeactivateAccountEmailController.sendDeactivateAccountEmail
	);
});

module.exports = router;
