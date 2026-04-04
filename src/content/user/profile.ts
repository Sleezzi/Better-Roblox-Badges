/// <reference path="../../../types/Window.d.ts" />

import awaitForElement from "../../components/awaitForElement";
import extension from "../../components/extension";

(async () => {
	if (!window.location.href.endsWith("/profile")) return;
	const container = await awaitForElement(".container-list.favorite-games-container .hlist.game-cards");
	if (!container) return;
	const userId = window.location.href.split("/")[4];
	for (const element of container.querySelectorAll("li.list-item.game-card.game-tile div.game-card-container" as "div")) {
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