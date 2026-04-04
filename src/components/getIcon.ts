import browser from "webextension-polyfill";

function getIcon(name: string) {
	return browser.runtime.getURL(`/img/Icons/${name}`);
}

export default getIcon;