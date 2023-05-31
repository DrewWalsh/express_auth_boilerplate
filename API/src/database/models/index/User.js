import Sequelize from "sequelize";
import db from "database/index";
import hashPassword from "database/hooks/hashPassword";
import {
	generateRefreshToken,
	generateAccessToken,
	authenticateLogin,
} from "modules/auth/auth.helpers.js";
const User = db.define(
	"user",
	{
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			unique: true,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: true,
		},
		username: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		isVerified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		pendingEmail: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		pendingPasswordReset: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		isDeleted: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		indexes: [
			{
				unique: true,
				name: "unique_username",
				fields: [db.fn("lower", db.col("username"))],
			},
			{
				unique: true,
				name: "unique_email",
				fields: [db.fn("lower", db.col("email"))],
			},
		],
		scopes: {
			cleanUser: {
				attributes: {
					exclude: [
						"email",
						"password",
						"isVerified",
						"pendingEmail",
						"pendingPasswordReset",
						"isDeleted",
						"createdAt",
						"updatedAt",
					],
				},
			},
		},
	}
);

User.beforeSave(hashPassword);
User.prototype.generateAuthTokens = async function () {
	const user = this;
	const refreshToken = await generateRefreshToken(user.id);
	const accessToken = await generateAccessToken(refreshToken);
	return { refreshToken, accessToken };
};
User.authenticateLogin = async function (email, password) {
	try {
		const user = await authenticateLogin(email, password, User);
		if (user) {
			return user;
		}
	} catch (e) {
		return e;
	}
};
export default User;
