import request from "supertest";
import app from "app";
import db from "database/index";
import { User } from "helpers/getModels";

let registerResponse;

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Send Delete Account Email Test", () => {
	it("tests for successfully sending delete account email", async () => {
		//Register user
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});

		const res = await request(app)
			.post("/api/email/send-deactivate-account")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				password: "TestPassword123",
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for blank password", async () => {
		const res = await request(app)
			.post("/api/email/send-deactivate-account")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				password: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMPTY_PASSWORD");
	});
	it("tests for invalid password", async () => {
		const res = await request(app)
			.post("/api/email/send-deactivate-account")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				password: "BadPassword123",
			});
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_INVALID_CREDENTIALS");
	});
});
