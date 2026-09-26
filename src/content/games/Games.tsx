import Badges from "../custom/BadgesComponents";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import _user from "../../components/user";

(async () => {
	const parent = await awaitForElement<"div">(".game-badges-list");
	if (!parent) return;

	const user = await _user();
	if (!user) return;

	if (parent.querySelector("#better-badges-badges-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-badges-container";
	
	createRoot(container).render(<Badges user={user} placeId={location.href.split("/")[4]} />);
	parent.appendChild(container);
})();