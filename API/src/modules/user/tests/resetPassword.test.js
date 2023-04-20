import request from "supertest";
import app from "app";
import db from "database/index";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import { User } from "helpers/getModels";
let testToken;
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Reset Password Test", () => {
	it("tests for successful password reset", async () => {
		//Register user
		await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		//Find user
		let user = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		user.pendingPasswordReset = true;
		await user.save();
		//create token with user ID to pass to the reset-password route
		testToken = await generateVerificationToken(user.id, "Reset Password");
		const res = await request(app)
			.post(`/api/user/reset-password/${testToken}`)
			.send({
				password: "NewPassword9000",
				passwordConfirm: "NewPassword9000",
			});
		//updated user model with new password
		let updatedUser = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});

		expect(user.password).not.toEqual(updatedUser.password);
		expect(updatedUser.pendingPasswordReset).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});

	it("tests for password mismatch", async () => {
		//create token with user ID to pass to the reset-password route
		const res = await request(app)
			.post(`/api/user/reset-password/${testToken}`)
			.send({
				password: "NewPassword9000",
				passwordConfirm: "NewPassword123",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_MISMATCH");
	});

	it("tests for invalid token", async () => {
		//create token with user ID to pass to the reset-password route
		const res = await request(app)
			.post("/api/user/reset-password/badtoken")
			.send({
				password: "NewPassword9000",
				passwordConfirm: "NewPassword9000",
			});
		expect(res.statusCode).toEqual(404);
		expect(res.body.key).toEqual("ERR_INVALID_TOKEN");
	});
	it("tests for blank new password", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post(`/api/user/reset-password/${testToken}`)
			.send({
				password: "",
				passwordConfirm: "FinalPassword3000",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_BLANK_NEW_PASSWORD");
	});
	it("tests for blank new password confirm", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post(`/api/user/reset-password/${testToken}`)
			.send({
				password: "FinalPassword3000",
				passwordConfirm: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_BLANK_NEW_PASSWORD_CONFIRM");
	});
	it("tests for bad password format", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post(`/api/user/reset-password/${testToken}`)
			.send({
				password: "password",
				passwordConfirm: "password",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_FORMAT");
	});
});
