global.__basedir = __dirname;
import "dotenv/config";
import config from "config";
import deleteDeactivatedUsers from "./modules/user/services/deleteDeactivatedUsers.service";
import "./database/index";
import "./database/associations/index";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import auth from "./modules/auth/auth.index";
import user from "./modules/user/user.index";
import email from "./modules/email/email.index";
// NEW PROJECT
// Set DB Names and Secrets in .env file
//Init new git repo
const app = express();

app.use(express.json({ limit: "200mb", extended: true }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
if (config.NODE_ENV !== "test") {
	app.use(morgan("combined"));
}
//Cors
const whitelist = ["http://localhost:3000", "https://domainname.ca"];
app.use(
	cors({
		credentials: true,
		origin: function (origin, callback) {
			if (whitelist.indexOf(origin !== 1)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
	})
);
//Helmet
if (config.NODE_ENV === "production") {
	app.use(helmet());
}
//Routes
const routes = [auth.routes, user.routes, email.routes];
routes.forEach((route) => {
	app.use("/api", route);
});
//Delete decativated users
deleteDeactivatedUsers();
if (config.NODE_ENV !== "test") {
	const PORT = config.PORT;
	app.listen(PORT, console.log(`Server started on port ${PORT}`));
}

module.exports = app;
