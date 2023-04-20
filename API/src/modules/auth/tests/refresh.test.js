import request from "supertest";
import app from "app";
import db from "database/index";

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Refresh Token Test", () => {
	it("tests for valid refresh token", async () => {
		//Register user to be logged in
		const registerResponse = await request(app)
			.post("/api/auth/register")
			.send({
				email: "testemail@example.com",
				username: "Test",
				password: "TestPassword123",
				passwordConfirm: "TestPassword123",
			});
		const res = await request(app)
			.post("/api/auth/refresh")
			.set("Cookie", registerResponse.headers["set-cookie"]);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("accessToken");
	});

	it("tests for invalid refresh token", async () => {
		const res = await request(app)
			.post("/api/auth/refresh")
			// .set("Cookie", "fake.auth.cookie");
			.set("Cookie", ["refreshToken=fake.cookie.invalid"]);
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_SESSION_EXPIRED");
	});
	it("tests for different invalid refresh token", async () => {
		const res = await request(app)
			.post("/api/auth/refresh")
			// .set("Cookie", "fake.auth.cookie");
			.set("Cookie", [
				"refreshToken=badtoken; Domain=localhost; Path=/; Expires=Fri, 12 Feb 2021 19:24:06 GMT; HttpOnly",
			]);
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_SESSION_EXPIRED");
	});
	it("tests for missing refresh token", async () => {
		const res = await request(app)
			.post("/api/auth/refresh")
			// .set("Cookie", "fake.auth.cookie");
			.set("Cookie", "");
		expect(res.statusCode).toEqual(401);
		expect(res.body.key).toEqual("ERR_SESSION_EXPIRED");
	});
});
