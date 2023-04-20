import request from "supertest";
import app from "app";
import db from "database/index";

let registerResponse;

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Send Email Change Test", () => {
	it("tests for successfully sending an email change", async () => {
		//Register user
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});

		const res = await request(app)
			.post("/api/email/send-email-change")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				newEmail: "newemail@example.com",
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for attempting to change to current email", async () => {
		const res = await request(app)
			.post("/api/email/send-email-change")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				newEmail: "testemail@example.com",
			});
		expect(res.statusCode).toEqual(409);
		expect(res.body.key).toEqual("ERR_CURRENT_EMAIL");
	});
	it("tests for blank email", async () => {
		const res = await request(app)
			.post("/api/email/send-email-change")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				newEmail: "",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_EMPTY");
	});
	it("tests for invalid email", async () => {
		const res = await request(app)
			.post("/api/email/send-email-change")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken)
			.send({
				newEmail: "thisisntanemail.com",
			});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_INVALID");
	});
});
