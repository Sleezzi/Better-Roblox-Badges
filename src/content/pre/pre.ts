/// <reference path="../../../types/Window.d.ts" />

const sleezzi: Sleezzi = {
	translate: ([message, substitution]) => chrome.i18n.getMessage(message, substitution),
	extension: () => ({
		id: chrome.runtime.id,
		icons: {
			128: chrome.runtime.getURL("/img/Icon_128.png"),
			48: chrome.runtime.getURL("/img/Icon_48.png"),
			32: chrome.runtime.getURL("/img/Icon_32.png"),
			16: chrome.runtime.getURL("/img/Icon_16.png")
		},
		name: chrome.i18n.getMessage("name")
	}),
	getIcon: (name) => chrome.runtime.getURL(`/img/Icons/${name}`)
};

window.addEventListener("message" as any, async (event: Message) => {
	if (event.source !== window) return;
	if (event.data.type !== "request") return;

	const element = sleezzi[event.data.request];

	if (!element) return;
	if (typeof element !== "function") {
		window.postMessage({
			type: "response",
			request: event.data.request,
			id: event.data.id,
			args: element
		}, "*");
		return;
	}
	const response = element(event.data.args as any);
	window.postMessage({
		type: "response",
		request: event.data.request,
		id: event.data.id,
		args: response
	}, "*");
});