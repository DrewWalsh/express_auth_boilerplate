import mailgun from "modules/email/services/mailgun.service";
import { errorLogger } from "logger";
import config from "config";
const sendDeactivateAccountEmail = async (user, token) => {
	try {
		const transporter = await mailgun();
		await transporter.sendMail(
			{
				from: "noreply@domainname.ca",
				to: user.email,
				subject: `Please confirm account deletion for Website.
				`,
				text: `Please confirm account deletion for domainname.ca
				You will be able to reactivate your account for 30 days,
				after which you will need to create a new account if you wish to use Website in the future.
				${config.CLIENT_ADDRESS}/deactivate-account/${token}`,
				html: `<p> Please confirm account deletion for domainname.ca. <br>
				You will be able to reactivate your account for 30 days, <br>
				after which you will need to create a new account if you wish to use Website in the future.
    </p> <br>   https://${config.CLIENT_ADDRESS}/deactivate-account/${token}`,
			},
			(err) => {
				if (err) {
					throw err;
				} else {
					return;
				}
			}
		);
	} catch (e) {
		errorLogger.error(e);
	}
};
module.exports = {
	sendDeactivateAccountEmail,
};
