import awaitForElement from "./awaitForElement";

export interface User {
	username: string;
	displayName: string;
	id: string;
}

const user = async () => {
	const element = await awaitForElement<"a">("meta[name=\"user-data\"");
	if (!element) return null;

	return {
		username: element.getAttribute("data-name")!,
		displayName: element.getAttribute("data-displayname")!,
		id: element.getAttribute("data-userid")!,
		isVerified: element.getAttribute("data-hasverifiedbadge") === "true"
	}
}

export default user;