import mailgun from "modules/email/services/mailgun.service";
import { errorLogger } from "logger";
import config from "config";
const sendVerificationEmail = async (user, token) => {
	try {
		const transporter = await mailgun();
		await transporter.sendMail(
			{
				from: "noreply@domainname.ca",
				to: user.email,
				subject:
					"Welcome to Website, " +
					user.username +
					"! Please Confirm Your Email",
				text: `Thank you for signing up for domainname.ca Please click here to verify your
					"email address ${config.CLIENT_ADDRESS}/verify/${token}`,
				html: `<p> Thank you for signing up for domainname.ca! Please click here to verify your 
        email address
    </p> <br>   https://${config.CLIENT_ADDRESS}/verify/${token}`,
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
	sendVerificationEmail,
};
