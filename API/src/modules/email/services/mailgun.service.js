import { errorLogger } from "logger";
import nodemailer from "nodemailer";
import config from "config";

const mailgun = async () => {
	try {
		const transporter = nodemailer.createTransport({
			pool: true,
			host: "smtp.mailgun.org",
			port: 465,
			secure: true,
			auth: {
				user: "noreply@domainname.ca",
				pass: config.MAILGUN_API_KEY,
			},
		});
		return transporter;
	} catch (e) {
		errorLogger.error(e);
		return;
	}
};
module.exports = mailgun;
