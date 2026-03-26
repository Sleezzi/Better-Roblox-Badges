import { createRoot } from "react-dom/client";

import Friends from "./Friends";
import Badges from "./Badges";

(async () => {
	const page = await window.sleezzi.awaitForElement<"div">("#content");
	if (!page) return;
	page.innerHTML = "";

	const place = window.location.href.split("/")[4];
	const user = window.location.href.split("/")[6];


	const userId = await window.sleezzi.userId();
	if (!userId) return;
	const root = createRoot(page);

	if (user) {
		root.render(<Badges placeId={place} friendId={user} />);
	} else {
		root.render(<Friends placeId={place} userId={userId} />);
	}
	document.title = `Roblox - ${(await window.sleezzi.api("extension")).name}`;
})();