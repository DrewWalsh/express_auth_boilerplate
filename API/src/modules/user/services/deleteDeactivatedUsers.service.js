import cron from "cron";
import { User } from "helpers/getModels";
import { Op } from "sequelize";
import { errorLogger } from "logger";
import moment from "moment";
import fs from "fs";


function deleteDeactivatedUsers() {
	try {
		//Cron will wipe personal info from all Users where isDeleted is true and has been set for 30 days to 30 years
		// 30 years ago
		let startDate = moment().subtract(30, "years").toDate();
		//  30 days ago
		let endDate = moment().subtract(30, "days").toDate();
		//Check for users to wipe every day at midnight (00:00)
		const job = new cron.CronJob("0 0 * * *", async () => {
			let usersToDelete = await User.findAll({
				where: {
					isDeleted: true,
					updatedAt: {
						[Op.between]: [startDate, endDate],
					},
					//If emaiil is null the user is already deleted
					email: {
						[Op.not]: null,
					},
				},
			});
			//Delete all personal info from selected users
			if (usersToDelete) {
				usersToDelete.forEach(async (user) => {
					user.email = null;
					user.password = "Deleted";
					user.username = user.id;
					user.pendingEmail = null;
					user.pendingPasswordReset = false;
					user.isVerified = false;
					user.userSeed = "";
					await user.save();
				});
			}
		});

		//Run CronJob
		job.start();
		return;
	} catch (e) {
		errorLogger.error(e);
	}
}

module.exports = deleteDeactivatedUsers;
