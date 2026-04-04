import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import _userId from "../../components/userId";
import Badges from "../badges/Badges";

(async () => {
	const userId = await _userId();
	if (!userId) return;
	const container = await awaitForElement<"div">(".game-badges-list");
	createRoot(container).render(<Badges placeId={window.location.href.split("/")[4]} friendId={userId} />);
})();