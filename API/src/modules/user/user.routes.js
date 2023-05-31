import { Router } from "express";
import isAuthenticated from "middleware/isAuthenticated";
import isActive from "middleware/isActive";
import FetchUserController from "modules/user/controllers/fetchUser.controller";
import ChangePasswordController from "modules/user/controllers/changePassword.controller";
import ChangePasswordPolicy from "modules/user/policies/changePassword.policy";
import ResetPasswordPolicy from "modules/user/policies/resetPassword.policy";
import VerifyTokenPolicy from "modules/user/policies/verifyToken.policy";
import VerifyUserController from "modules/user/controllers/verifyUser.controller";
import ChangeEmailController from "modules/user/controllers/changeEmail.controller";
import ChangeUsernameController from "modules/user/controllers/changeUsername.controller";
import ChangeUsernamePolicy from "modules/user/policies/changeUsername.policy";
import ResetPasswordController from "modules/user/controllers/resetPassword.controller";
import DeactivateAccountController from "modules/user/controllers/deactivateAccount.controller";
import ReactivateAccountController from "modules/user/controllers/reactivateAccount.controller";

const router = Router();
router.get("/user", isAuthenticated, FetchUserController.fetchUser);
router.post(
	"/user/change-password",
	isAuthenticated,
	isActive,
	ChangePasswordPolicy.changePassword,
	ChangePasswordController.changePassword
);
router.post(
	"/user/reactivate-account",
	isAuthenticated,
	ReactivateAccountController.reactivateAccount
);
router.post(
	"/user/change-username",
	isAuthenticated,
	ChangeUsernamePolicy.changeUsername,
	ChangeUsernameController.changeUsername
);
//=====TOKEN BASED=====
//No auth needed
router.post(
	"/user/verify/:token",
	VerifyTokenPolicy.verifyToken,
	VerifyUserController.verifyUser
);
router.post(
	"/user/change-email/:token",
	VerifyTokenPolicy.verifyToken,
	ChangeEmailController.changeEmail
);

router.post(
	"/user/reset-password/:token",
	VerifyTokenPolicy.verifyToken,
	ResetPasswordPolicy.resetPassword,
	ResetPasswordController.resetPassword
);
router.post(
	"/user/deactivate-account/:token",
	VerifyTokenPolicy.verifyToken,
	DeactivateAccountController.deactivateAccount
);

module.exports = router;
