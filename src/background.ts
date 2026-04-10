import browser from "webextension-polyfill";

browser.action.onClicked.addListener(() => {
	browser.tabs.create({ url: "https://www.roblox.com/my/account?page=better-roblox-badges#!/info" });
});