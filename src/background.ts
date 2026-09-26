import browser from "webextension-polyfill";
import extension from "./components/extension";

browser.action.onClicked.addListener(() => {
	browser.tabs.create({ url: "https://www.roblox.com/better-badges" });
});

const clearLogs = async () => {
	await browser.storage.local.set({ logs: [] });
}

browser.runtime.onInstalled.addListener(async (details) => {
	await clearLogs();
	await browser.tabs.create({
		url: `https://better-roblox-badges.sleezzi.fr/changelog/${extension.version}?reason=${details.reason === "install" ? "intall" : "update"}`,
	});
});

browser.runtime.onStartup.addListener(clearLogs);

browser.runtime.onMessage.addListener((request: any, sender, sendResponse) => {
	if (!sender.tab || !sender.tab.id) return true;
	const message: { request: string, args: any } = request;
	switch (message.request) {
		case "inject":
			if (message.args.css && message.args.css.length > 0) {
				browser.scripting.insertCSS({
					target: {
						tabId: sender.tab.id
					},
					files: message.args.css,
				});
			}
			if (message.args.js && message.args.js.length > 0) {
				browser.scripting.executeScript({
					target: {
						tabId: sender.tab.id
					},
					files: message.args.js,
					injectImmediately: true
				});
			}
			sendResponse(null);
			break;
		case "inject.remove":
			browser.scripting.removeCSS({
				target: {
					tabId: sender.tab.id
				},
				files: message.args
			});
			sendResponse(null);
			break
		default:
			console.error("Invalid request", request);
			sendResponse(null);
			break;
	}
	return true;
});