import { errorLogger } from "logger";

const getDifference = (array1, array2, property) => {
	try {
		return array1.filter((object1) => {
			return !array2.some((object2) => {
				return object1[property] === object2[property];
			});
		});
	} catch (e) {
		errorLogger.error("objectArrayDifference.js:");
		errorLogger.error(e);
	}
};

export default getDifference;
