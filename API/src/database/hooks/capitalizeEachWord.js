async function capitalizeEachWord(model) {
	if (model.name) {
		model.name = model.name
			.toLowerCase()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(" ");
	}
	return;
}

module.exports = capitalizeEachWord;
