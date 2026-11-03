import Badges from "./BadgesComponents";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import getDetails from "../../components/api/user/getDetails";
import getUrlParts from "../../components/getUrlsParts";

(async () => {
	const parent = await awaitForElement<"div">("#content");
	if (!parent) return;

	if (parent.querySelector("#better-badges-custom-badges-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-custom-badges-container";

	const [placeId, id] = [getUrlParts()[1], getUrlParts()[2]];

	const user = await getDetails(id);
	
	if (!user) return;

	createRoot(container).render(<Badges user={{ username: user.name, displayName: user.displayName, id: id }} placeId={placeId} />);
	parent.appendChild(container);
})();