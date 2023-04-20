import request from "supertest";
import app from "app";
import db from "database/index";
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Login Test", () => {
	it("tests for successful login", async () => {
		//Register user to be logged in
		await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		const res = await request(app).post("/api/auth/login").send({
			email: "testemail@example.com",
			password: "TestPassword123",
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("accessToken");
	});
	it("tests for invalid email", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "invalid@example.com",
			password: "TestPassword123",
		});
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_INVALID_CREDENTIALS");
	});
	it("tests for invalid password", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "testemail@example.com",
			password: "InvalidPassword456",
		});
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_INVALID_CREDENTIALS");
	});
	it("tests for missing email", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "",
			password: "InvalidPassword456",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_EMPTY");
	});
	it("tests for missing password", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "testemail@example.com",
			password: "",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_EMPTY");
	});
});
