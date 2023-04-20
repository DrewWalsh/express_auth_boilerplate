import request from "supertest";
import app from "app";
import db from "database/index";

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Send Password Reset Email Test", () => {
	it("tests for successfully sending a password reset email", async () => {
		//Register user
		await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});

		const res = await request(app).post("/api/email/send-password-reset").send({
			email: "testemail@example.com",
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for blank email", async () => {
		const res = await request(app).post("/api/email/send-password-reset").send({
			email: "",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_EMPTY");
	});
	it("tests for invalid email", async () => {
		const res = await request(app).post("/api/email/send-password-reset").send({
			email: "thisisntanemail.com",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_INVALID");
	});
});
