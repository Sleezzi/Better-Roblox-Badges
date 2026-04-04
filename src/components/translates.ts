import browser from "webextension-polyfill";

function Translates(messages: string[]) {
	const result: { [message: string]: string | null } = {};
	for (const message of messages) {
		result[message] = browser.i18n.getMessage(message) || null;
	}
	return result;
}

export default Translates;