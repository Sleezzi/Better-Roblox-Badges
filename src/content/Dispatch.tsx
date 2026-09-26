import { createRoot } from "react-dom/client";

import _userId from "../components/user";
import awaitForElement from "../components/awaitForElement";
import { useEffect } from "react";
import browser from "webextension-polyfill";
import pages from "./pages";

function Dispatch() {
	useEffect(() => {
		const files: {
			inject: {
				js: string[],
				css: string[]
			},
			remove: {
				css: string[]
			}
		} = {
			inject: {
				js: [],
				css: []
			},
			remove: {
				css: []
			}
		}
		for (const page of pages) {
			const isMatching = page.url.find((url) => RegExp(`^https:\/\/(www\.)?roblox\.com\/${url.source}`).test(location.href));
			if (!isMatching) {
				files.remove.css = page.css.concat(files.remove.css);
				continue;
			}
			files.inject.css = page.css.concat(files.inject.css);
			files.inject.js = page.js.concat(files.inject.js);
		}

		browser.runtime.sendMessage({
			request: "inject.remove",
			args: files.remove.css
		}).then(() => {
			browser.runtime.sendMessage({
				request: "inject",
				args: {
					js: files.inject.js,
					css: files.inject.css
				}
			});
		});
		return () => {
			browser.runtime.sendMessage({
				request: "inject.remove",
				args: pages.map((page) => page.css).flat()
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