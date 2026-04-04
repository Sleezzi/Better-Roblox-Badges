import browser from "webextension-polyfill";

const extension = {
	id: browser.runtime.id,
	icons: {
		128: browser.runtime.getURL("/img/Icon_128.png"),
		48: browser.runtime.getURL("/img/Icon_48.png"),
		32: browser.runtime.getURL("/img/Icon_32.png"),
		16: browser.runtime.getURL("/img/Icon_16.png")
	},
	name: browser.i18n.getMessage("name")
}

export default extension;