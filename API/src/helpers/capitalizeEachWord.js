import { errorLogger } from "logger";

const capitalizeEachWord = (string) => {
	try {
		string = string
			.toLowerCase()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(" ");

		return string;
	} catch (e) {
		if (e) {
			errorLogger.error("capitalizeEachWord.js:");
			errorLogger.error(e);
		}
	}
};

export default capitalizeEachWord;
