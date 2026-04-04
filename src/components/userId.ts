import awaitForElement from "./awaitForElement";

const userId = async () => {
	const element = await awaitForElement<"a">("#right-navigation-header .age-bracket-label.text-header a");
	if (!element) return null;
	if (element.href.split("/")[4] === "users") {
		return element.href.split("/")[5];
	}
	return element.href.split("/")[4];
}

export default userId;