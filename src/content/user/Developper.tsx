import { createRoot } from "react-dom/client";
import awaitForElement from "../../components/awaitForElement";
import getIcon from "../../components/getIcon";

function Icon() {
	return (
		<span className="items-center gap-xxsmall flex shrink-0">
			<span
				role="presentation"
				className="grow-0 shrink-0 basis-auto icon size-[var(--icon-size-large)] content-system-contrast"
				style={{
					mask: `url(${getIcon("award.png")})`,
					background: "gold"
				}}
			></span>
		</span>
	)
}

(async () => {
	const username = await awaitForElement("#profile-header-title-container-name");
	createRoot(username.parentElement!).render(
		<>
			<span id="profile-header-title-container-name" className="text-heading-large min-width-0 text-truncate-end text-no-wrap">Sleezzi</span>
			<Icon />
		</>
	);
})();