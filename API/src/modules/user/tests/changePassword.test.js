import request from "supertest";
import app from "app";
import db from "database/index";
import { User } from "helpers/getModels";

let registerResponse;
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Change Password Test", () => {
	it("tests for successful password change", async () => {
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		const user = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "TestPassword123",
				newPassword: "NewPassword9000",
				newPasswordConfirm: "NewPassword9000",
			});
		const updatedUser = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		expect(user.password).not.toEqual(updatedUser.password);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});

	it("tests for new password mismatch", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "NewPassword9000",
				newPassword: "FinalPassword3000",
				newPasswordConfirm: "FinalPassword1",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_MISMATCH");
	});
	it("tests for invalid old password", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "BadPassword123",
				newPassword: "FinalPassword3000",
				newPasswordConfirm: "FinalPassword3000",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_OLD_PASSWORD_INVALID");
	});
	it("tests for blank old password", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "",
				newPassword: "FinalPassword3000",
				newPasswordConfirm: "FinalPassword3000",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_BLANK_OLD_PASSWORD");
	});
	it("tests for blank new password", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "BadPassword123",
				newPassword: "",
				newPasswordConfirm: "FinalPassword3000",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_BLANK_NEW_PASSWORD");
	});
	it("tests for blank new password confirm", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "BadPassword123",
				newPassword: "FinalPassword3000",
				newPasswordConfirm: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_BLANK_NEW_PASSWORD_CONFIRM");
	});
	it("tests for bad password format", async () => {
		//Register user to be logged in
		const res = await request(app)
			.post("/api/user/change-password")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				oldPassword: "BadPassword123",
				newPassword: "password",
				newPasswordConfirm: "password",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_FORMAT");
	});
});
