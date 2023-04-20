import request from "supertest";
import app from "app";
import db from "database/index";

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Registration Tests", () => {
	it("tests for successful registration", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("accessToken");
	});
	it("tests for duplicate email", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(409);
		expect(res.body.key).toEqual("ERR_EMAIL_IN_USE");
	});
	it("tests for missing email", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_EMPTY");
	});
	it("tests for invalid email", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "testexample.com",
			username: "Test",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_EMAIL_INVALID");
	});
	it("tests for empty first name", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_USERNAME_EMPTY");
	});
	it("tests for invalid first name", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "TE{!ST",

			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_username_INVALID");
	});

	it("tests for empty password", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "Test",
			password: "",
			passwordConfirm: "TestPassword123",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_EMPTY");
	});
	it("tests for invalid password", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "Test",
			password: "secure",
			passwordConfirm: "secure",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_FORMAT");
	});
	it("tests for empty password confirm", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_CONFIRM_EMPTY");
	});
	it("tests for password mismatch", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword456",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_MISMATCH");
	});
	it("tests for password format error", async () => {
		const res = await request(app).post("/api/auth/register").send({
			email: "test@example.com",
			username: "Test",
			password: "passsword",
			passwordConfirm: "password",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.key).toEqual("ERR_PASSWORD_FORMAT");
	});
});
