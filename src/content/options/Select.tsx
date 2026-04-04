import { useEffect, useState } from "react";
import Translates from "../../components/translates";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";


const localesToGet = ["name"];

function Button() {
	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	return (
		<>
			<a href="/my/account?page=better-roblox-badges" className={`menu-option-content${window.location.href.endsWith("/my/account?page=better-roblox-badges") ? " active" : ""}`}>
				<span className="font-caption-header">
					{locales.name || "Better Roblox Badges"}
				</span>
			</a>
		</>
	);
}


(async () => {
	const select = await awaitForElement<"ul">(".settings-left-navigation .menu-vertical");
	if (!select) return;

	const container = document.createElement("li");

	createRoot(container).render(<Button />);

	select.appendChild(container);
})();