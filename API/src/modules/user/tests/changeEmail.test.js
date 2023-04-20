import request from "supertest";
import app from "app";
import db from "database/index";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import { User } from "helpers/getModels";
let registerResponse;
let testToken;
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Change Email Test", () => {
	it("tests for successful email change", async () => {
		registerResponse = await request(app).post("/api/auth/register").send({
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
		//sets a pending email to mock an email change request
		user.pendingEmail = "newemail@example.com";
		await user.save();
		//create token with user ID to pass to the reset-password route
		testToken = await generateVerificationToken(user.id, "Change Email");
		const res = await request(app)
			.post(`/api/user/change-email/${testToken}`)
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		//Ensure the email properly updated
		let updatedUser = await User.findOne({
			where: {
				email: "newemail@example.com",
			},
		});
		expect(updatedUser.email).toEqual("newemail@example.com");
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for invalid token pattern", async () => {
		//create token with user ID to pass to the reset-password route
		const res = await request(app)
			.post("/api/user/change-email/badtoken")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		expect(res.statusCode).toEqual(404);
		expect(res.body.key).toEqual("ERR_INVALID_TOKEN");
	});
	it("tests for invalid token", async () => {
		//create token with user ID to pass to the reset-password route
		const res = await request(app)
			.post("/api/user/change-email/bad.email.token")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		expect(res.statusCode).toEqual(404);
		expect(res.body.key).toEqual("ERR_INVALID_TOKEN");
	});
});
