import request from "supertest";
import app from "app";
import db from "database/index";
let registerResponse;
beforeAll(() => db.sync({ force: true, logging: false }));
describe("Get User Test", () => {
	it("tests for successfully getting the user", async () => {
		//Register user to be logged in
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		const res = await request(app)
			.get("/api/user")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		expect(res.statusCode).toEqual(200);
		expect(res.body.user).toHaveProperty("id");
		expect(res.body.user.email).toEqual("testemail@example.com");
		expect(res.body).not.toHaveProperty("password");
	});
});
