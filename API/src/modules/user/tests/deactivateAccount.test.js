import request from "supertest";
import app from "app";
import db from "database/index";
import { generateVerificationToken } from "modules/auth/auth.helpers";
import { User } from "helpers/getModels";
let testToken;
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Deactivate Account Test", () => {
	it("tests for successful user deactivation", async () => {
		//Register user
		await request(app).post("/api/auth/register").send({
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
		const res = await request(app).post(
			`/api/user/deactivate-account/${testToken}`
		);
		const updatedUser = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		expect(updatedUser.isDeleted).toEqual(true);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for already deactivated user", async () => {
		const res = await request(app).post(
			`/api/user/deactivate-account/${testToken}`
		);
		expect(res.statusCode).toEqual(409);
		expect(res.body.key).toEqual("ERR_USER_ALREADY_DEACTIVATED");
	});
	it("tests for invalid token pattern", async () => {
		const res = await request(app).post("/api/user/verify/badtoken");
		expect(res.statusCode).toEqual(404);
		expect(res.body.key).toEqual("ERR_INVALID_TOKEN");
	});
	it("tests for invalid token", async () => {
		const res = await request(app).post("/api/user/verify/bad.verify.token");
		expect(res.statusCode).toEqual(404);
		expect(res.body.key).toEqual("ERR_INVALID_TOKEN");
	});
});
