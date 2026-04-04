import { createRoot } from "react-dom/client";

import Friends from "./Friends";
import Badges from "./Badges";
import _userId from "../../components/userId";
import awaitForElement from "../../components/awaitForElement";
import extension from "../../components/extension";

(async () => {
	const page = await awaitForElement<"div">("#content");
	if (!page) return;
	page.innerHTML = "";

	const place = window.location.href.split("/")[4];
	const user = window.location.href.split("/")[6];


	const userId = await _userId();
	if (!userId) return;
	const root = createRoot(page);

	if (user) {
		root.render(<Badges placeId={place} friendId={user} />);
	} else {
		root.render(<Friends placeId={place} userId={userId} />);
	}
	document.title = `Roblox - ${extension.name}`;
})();