(async () => {
	const select = await window.sleezzi.awaitForElement<"ul">(".settings-left-navigation .menu-vertical");

	const option = document.createElement("li");
	option.className = "menu-option";
	option.role = "tab";
	select.appendChild(option);

	const a = document.createElement("a");
	a.href = "/my/account?page=better-roblox-badges";
	a.className = "menu-option-content";
	if (window.location.href.endsWith("/my/account?page=better-roblox-badges")) a.classList.add("active");
	option.appendChild(a);

	const span = document.createElement("span");
	span.className = "font-caption-header";
	span.innerText = await window.sleezzi.api("translate", "name");
	a.appendChild(span);
})();


(async () => { // Mobile version
	const select = await window.sleezzi.awaitForElement<"select">(".select-group.mobile-navigation-dropdown select");

	const option = document.createElement("option");
	option.value = "better-roblox-badges";
	option.innerText = await window.sleezzi.api("translate", "name");
	select.appendChild(option);


	select.onchange = async () => {
		if (select.value === "better-roblox-badges") {
			window.location.href = "/my/account?page=better-roblox-badges";
		}
	}
})();