import browser from "webextension-polyfill";

function Translates(messages: string[]) {
	const result: Record<string, string> = {};
	for (const message of messages) {
		const translate = browser.i18n.getMessage(message);
		if (!translate) continue;
		result[message] = translate;
	}
	return result;
}

export default Translates;