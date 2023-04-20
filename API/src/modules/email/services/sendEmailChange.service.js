import mailgun from "modules/email/services/mailgun.service";
import { errorLogger } from "logger";
import config from "config";
const sendEmailChange = async (user, token) => {
	try {
		const transporter = await mailgun();
		await transporter.sendMail(
			{
				from: "noreply@domainname.ca",
				to: user.pendingEmail,
				subject: "Confirm your new email ",
				text: `Hello, ${user.username}, please confirm your new email for domainname.ca using the link below. Disregard this message if you did not make this request
          ${config.CLIENT_ADDRESS}/change-email/${token}
          `,
				html: `<p> Hello, ${user.username}, please confirm your new email for domainname.ca using the link below. Disregard this message if you did not make this request
    </p> <br>   https://${config.CLIENT_ADDRESS}/change-email/${token}`,
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
	sendEmailChange,
};
