import mailgun from "modules/email/services/mailgun.service";
import { errorLogger } from "logger";
import config from "config";
const sendPasswordResetEmail = async (user, token) => {
	try {
		const transporter = await mailgun();
		await transporter.sendMail(
			{
				from: "noreply@domainname.ca",
				to: user.email,
				subject: "Reset your password",
				text: `An account with this email at domainname.ca has requested a password reset.
          If you did not make this request, disregard this email.
          ${config.CLIENT_ADDRESS}/reset-password/${token}
          `,
				html: `<p> An account with this email at domainname.ca has requested a password reset. If you did not make this request, disregard this email.
    </p> <br>   https://${config.CLIENT_ADDRESS}/reset-password/${token}`,
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
	sendPasswordResetEmail,
};
