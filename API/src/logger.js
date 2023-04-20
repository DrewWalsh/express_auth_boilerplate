import log4js from "log4js";

log4js.configure({
	appenders: {
		error: { type: "file", filename: "logs/error.log" },
		audit: { type: "file", filename: "logs/audit.log" },
	},
	categories: {
		default: { appenders: ["error"], level: "error" },
		audit: { appenders: ["audit"], level: "info" },
	},
});
const errorLogger = log4js.getLogger("error");
const auditLogger = log4js.getLogger("audit");
module.exports = { auditLogger, errorLogger };
