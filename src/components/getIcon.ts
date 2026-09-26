import browser from "webextension-polyfill";

function getIcon(name: string) {
	return browser.runtime.getURL(`/assets/img/Icons/${name}`);
}

export default getIcon;