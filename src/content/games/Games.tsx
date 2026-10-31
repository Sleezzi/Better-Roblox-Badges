import Badges from "../custom/BadgesComponents";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import _user from "../../components/user";
import Console from "../../components/console";
import Notify from "../global/Notifications";

(async () => {
	const parent = await awaitForElement<"div">(".game-badges-list");
	if (!parent) return;

	const user = await _user();
	if (!user) {
		Notify("Error", "Unable to retrieve the user ID.");
		Console("Unable to retrieve the user ID.");
		return;
	}

	if (parent.querySelector("#better-badges-badges-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-badges-container";
	
	createRoot(container).render(<Badges user={user} placeId={location.href.split("/")[4]} />);
	parent.appendChild(container);
})();