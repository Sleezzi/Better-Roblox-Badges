/// <reference path="../../../types/Window.d.ts" />


(async () => {
	const badgesContainer = await window.sleezzi.awaitForElement<"div">(".game-badges-list");
	
	const badges: { [id: string]: "unset" | string } = {};
	let hide: "any" | "owned" | 'not-owned' = "any";

	const update = async () => {
		const badgesContainer = await window.sleezzi.awaitForElement<"div">(".game-badges-list");
		const userId = await window.sleezzi.userId();
		if (!userId) return;
		if (!badgesContainer.querySelector(".stack-list > .badge-row:not([badge-id])")) return; // All badges have their IDs in the attributes
		for (const element of badgesContainer.querySelectorAll(".stack-list > .badge-row:not([badge-id])" as "div")) {
			const a = element.querySelector(".badge-image > a" as "a");
			if (!a) return;
			const badgeId = a.href.split("/")[4] === "badges" ? a.href.split("/")[5] : a.href.split("/")[4];
			if (badges[badgeId]) return;
			badges[badgeId] = "unset";
			element.setAttribute("badge-id", badgeId);
			if (element.querySelector(".badge-content .badge-stats-container li:nth-child(2) .badge-stats-info")) {
				element.querySelector(".badge-content .badge-stats-container li:nth-child(2) .badge-stats-info" as "div")!.innerText = window.sleezzi.splitNumber(element.querySelector(".badge-content .badge-stats-container li:nth-child(2) .badge-stats-info" as "div")!.innerText);
			}
			if (element.querySelector(".badge-content .badge-stats-container li:nth-child(3) .badge-stats-info")) {
				element.querySelector(".badge-content .badge-stats-container li:nth-child(3) .badge-stats-info" as "div")!.innerText = window.sleezzi.splitNumber(element.querySelector(".badge-content .badge-stats-container li:nth-child(3) .badge-stats-info" as "div")!.innerText);
			}
		}
		await fetch(`https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${Object.entries(badges).filter(([badgeId, status]) => status === "unset").map(([badgeId]) => badgeId).join(",")}`, {
			method: "GET",
			credentials: "include"
		})
		.then(response => response.json())
		.then((response: {
				data: {
					badgeId: number,
					awardedDate: string
				}[]
			}) => {
			if (!response.data) return;
			for (const badge of response.data) {
				badges[badge.badgeId] = badge.awardedDate;
			}
			update();
		});
		for (const [id, date] of Object.entries(badges)) {
			const element = document.querySelector(`.game-badges-list > .stack-list > .badge-row[badge-id="${id}"]`);
			if (!element) return;
			const container = document.createElement("div");
			container.className = "badge-owned-container";
			const span = document.createElement("span");
			
			if (date === "unset") {
				span.innerText = "✖";
				element.setAttribute("owned", "false");
			} else {
				span.innerText = "✓";
				span.className = "owned";
				
				const textLabel = document.createElement("div");
				textLabel.className = "text-label";
				textLabel.innerText = await window.sleezzi.parseDate(date);
				span.appendChild(textLabel);
				element.setAttribute("owned", "true");
			}
			container.appendChild(span);
			element.appendChild(container);
			
			if (hide === "any") {
				element.setAttribute("active", "true");
			}
			if (hide === "owned") {
				element.setAttribute("active", `${date !== "unset"}`);
			}
			if (hide === "not-owned") {
				element.setAttribute("active", `${date === "unset"}`);
			}
		}
	}
	if (localStorage.getItem("loadAllBadges") === "true") {
		const click = () => {
			const button = badgesContainer.querySelector("li > button" as "button");
			if (!button) return;
			button.click();
			click();
		}
		click();
	}
	update();
	const observer = new MutationObserver(update);
	observer.observe(badgesContainer, {
		childList: true,
		subtree: true
	});

	if (badgesContainer.querySelector(".container-header") && !badgesContainer.querySelector(".container-header #badge-filter")) {
		const viewAs = document.createElement("a");
		viewAs.href = `/better-badges/${window.location.href.split("/")[4]}`;
		viewAs.innerText = await window.sleezzi.api("translate", "badges_view_as");
		badgesContainer.querySelector(".container-header")?.appendChild(viewAs);

		const search = document.createElement("input");
		search.type = "search";
		search.className = "input-field new-input-field badge-search";
		search.autocomplete = "off";
		search.spellcheck = false;
		search.setAttribute("autocorrect", "off");
		search.placeholder = await window.sleezzi.api("translate", "badges_search");
		search.maxLength = 120;
		search.setAttribute("data-testid", "navigation-search-input-field");
		search.oninput = () => {
			if (search.value.length === 0) {
				for (const element of document.querySelectorAll(".badge-row[active=\"false\"]")) {
					element.setAttribute("active", "true");
				}
				return;
			}
			for (const [id, owned] of Object.entries(badges)) {
				const element = badgesContainer.querySelector(`.badge-row[badge-id="${id}"]`);
				if (!element) continue;
				element.setAttribute(
					"active",
					element.querySelector(".badge-content .badge-data-container .badge-name" as "div")?.innerText.toLowerCase().includes(search.value.toLowerCase()) ?
					"true" : "false"
				);
			}
		}
		badgesContainer.querySelector(".container-header")?.appendChild(search);
		const [filterContainer, filter] = window.sleezzi.components.createSelect({
			any: await window.sleezzi.api("translate", "badges_not_filtered"),
			"owned": await window.sleezzi.api("translate", "badges_owned_only"),
			"not-owned": await window.sleezzi.api("translate", "badges_not_owned_only")
		});
		filterContainer.id = "badge-filter";

		const selectorsContainer = document.createElement("div");
		selectorsContainer.className = "badge-selectors-container";

		filter.onchange = () => {
			if (filter.value === "any") {
				badgesContainer.querySelectorAll(".stack-list > .badge-row[badge-id][active=\"false\"]" as "div").forEach((element) => element.setAttribute("active", "true"));
			}
			if (filter.value === "owned") {
				badgesContainer.querySelectorAll(".stack-list > .badge-row[badge-id][owned=\"true\"][active=\"false\"]" as "div")
				.forEach((element) => element.setAttribute("active", "true"));

				badgesContainer.querySelectorAll(".stack-list > .badge-row[badge-id][owned=\"false\"][active=\"true\"]" as "div")
				.forEach((element) => element.setAttribute("active", "false"));
			}
			
			if (filter.value === "not-owned") {
				badgesContainer.querySelectorAll(".stack-list > .badge-row[badge-id][owned=\"true\"][active=\"true\"]" as "div")
				.forEach((element) => element.setAttribute("active", "false"));

				badgesContainer.querySelectorAll(".stack-list > .badge-row[badge-id][owned=\"false\"][active=\"false\"]" as "div")
				.forEach((element) => element.setAttribute("active", "true"));
			}
			hide = filter.value as any;
		}
		filter.value = hide;
		selectorsContainer.appendChild(filterContainer);

		const sortContainer = document.createElement("button");
		sortContainer.id = "badge-sort";

		const sort = document.createElement("img");
		sort.src = await window.sleezzi.api("getIcon", "rows-3.png");

		sortContainer.onclick = async () => {
			if (badgesContainer.classList.contains("badge-grid")) {
				sort.src = await window.sleezzi.api("getIcon", "rows-3.png");
				badgesContainer.classList.remove("badge-grid");
			} else {
				sort.src = await window.sleezzi.api("getIcon", "layout-grid.png");
				badgesContainer.classList.add("badge-grid");
			}
		}

		sortContainer.appendChild(sort);

		selectorsContainer.appendChild(sortContainer);

		badgesContainer.querySelector(".container-header")?.appendChild(selectorsContainer);
	}
})();