import request from "supertest";
import app from "app";
import db from "database/index";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import { User } from "helpers/getModels";
let registerResponse;
let testToken;

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Reactivate Account Test", () => {
	it("tests for successful user reactivation", async () => {
		//Register user
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});

		//Find user
		const user = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		//create token with user ID to pass to the reset-password route
		testToken = await generateVerificationToken(user.id, "Deactivate User");
		await request(app).post(`/api/user/deactivate-account/${testToken}`);

		//create token with user ID to pass to the reset-password route
		const res = await request(app)
			.post("/api/user/reactivate-account")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		const updatedUser = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		expect(updatedUser.isDeleted).toEqual(false);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
});
