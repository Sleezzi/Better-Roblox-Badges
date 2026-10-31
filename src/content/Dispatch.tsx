import { createRoot } from "react-dom/client";

import _userId from "../components/user";
import awaitForElement from "../components/awaitForElement";
import { useEffect } from "react";
import browser from "webextension-polyfill";
import pages from "./pages";

function Dispatch() {
	useEffect(() => {
		const inject = {
			js: new Set<string>(),
			css: new Set<string>()
		}
		const remove = new Set<string>();

		for (const page of pages) {
			const isMatching = page.url.find((url) => RegExp(`^https:\/\/(www\.)?roblox\.com\/${url.source}`).test(location.href));
			if (!isMatching) continue;
			page.css.forEach((file) => inject.css.add(file));
			page.js.forEach((file) => inject.js.add(file));
		}
		for (const page of pages) {
			for (const file of page.css) {
				if (!inject.css.has(file)) remove.add(file);
			}
		}
		browser.runtime.sendMessage({
			request: "inject.remove",
			args: [...remove]
		}).then(() => {
			browser.runtime.sendMessage({
				request: "inject",
				args: {
					js: [...inject.js],
					css: [...inject.css]
				}
			});
		});
		return () => {
			browser.runtime.sendMessage({
				request: "inject.remove",
				args: pages.flatMap((page) => page.css)
			});
		}
	}, [location.href]);

	return (<></>);
}

(async () => {
	const page = await awaitForElement<"div">("#content");
	if (!page) return;

	const container = page.querySelector("#better-roblox-badges-dispatch" as "div") || document.createElement("div");
	container.id = "better-roblox-badges-dispatch";
	page.appendChild(container);

	createRoot(container).render(<Dispatch />);
})();