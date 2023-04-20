import request from "supertest";
import app from "app";
import db from "database/index";
import { User } from "helpers/getModels";

let registerResponse;

beforeAll(() => db.sync({ force: true, logging: false }));
describe("Resend Verification Email Test", () => {
	it("tests for successfully resending verification email", async () => {
		//Register user
		registerResponse = await request(app).post("/api/auth/register").send({
			email: "testemail@example.com",
			username: "Test",
			password: "TestPassword123",
			passwordConfirm: "TestPassword123",
		});
		const res = await request(app)
			.post("/api/email/resend-verification-email")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);
		expect(res.statusCode).toEqual(200);
		expect(res.body.success).toEqual(true);
	});
	it("tests for already verified user", async () => {
		let user = await User.findOne({
			where: {
				email: "testemail@example.com",
			},
		});
		user.isVerified = true;
		await user.save();

		const res = await request(app)
			.post("/api/email/resend-verification-email")
			.set("Authorization", "Bearer " + registerResponse.body.accessToken);

		expect(res.body.key).toEqual("ERR_USER_ALREADY_VERIFIED");
		expect(res.statusCode).toEqual(409);
	});
});
