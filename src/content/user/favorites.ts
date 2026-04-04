/// <reference path="../../../types/Window.d.ts" />

import awaitForElement from "../../components/awaitForElement";
import extension from "../../components/extension";

(async () => {
	if (!window.location.href.endsWith("#!/places")) return;
	const userId = window.location.href.split("/")[4];
	const container = await awaitForElement("#assetsItems");
	if (!container) return;
	
	await awaitForElement("#assetsItems li.list-item.item-card.ng-scope.place-item div.item-card-container"); // Await for items to load.

	for (const element of container.querySelectorAll("li.list-item.item-card.ng-scope.place-item div.item-card-container" as "div")) {
		const game = (element.querySelector("a") as HTMLAnchorElement).href.split("/")[4];

		const button = document.createElement("a");
		button.href = `/better-badges/${game}/user/${userId}`;
		button.className = "btn-generic-more-sm badge";
		element.appendChild(button);

		const icon = document.createElement("img");
		icon.src = extension.icons[128];
		button.appendChild(icon);
	}
})();