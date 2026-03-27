import { createRoot } from "react-dom/client";

function Icon() {
	return (
		<span className="items-center gap-xxsmall flex shrink-0">
			<span role="presentation" className="grow-0 shrink-0 basis-auto icon size-[var(--icon-size-large)] content-system-contrast"
			style={{
				mask: "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhlYXJ0LWhhbmRzaGFrZS1pY29uIGx1Y2lkZS1oZWFydC1oYW5kc2hha2UiPjxwYXRoIGQ9Ik0xOS40MTQgMTQuNDE0QzIxIDEyLjgyOCAyMiAxMS41IDIyIDkuNWE1LjUgNS41IDAgMCAwLTkuNTkxLTMuNjc2LjYuNiAwIDAgMS0uODE4LjAwMUE1LjUgNS41IDAgMCAwIDIgOS41YzAgMi4zIDEuNSA0IDMgNS41bDUuNTM1IDUuMzYyYTIgMiAwIDAgMCAyLjg3OS4wNTIgMi4xMiAyLjEyIDAgMCAwLS4wMDQtMyAyLjEyNCAyLjEyNCAwIDEgMCAzLTMgMi4xMjQgMi4xMjQgMCAwIDAgMy4wMDQgMCAyIDIgMCAwIDAgMC0yLjgyOGwtMS44ODEtMS44ODJhMi40MSAyLjQxIDAgMCAwLTMuNDA5IDBsLTEuNzEgMS43MWEyIDIgMCAwIDEtMi44MjggMCAyIDIgMCAwIDEgMC0yLjgyOGwyLjgyMy0yLjc2MiIvPjwvc3ZnPg==)",
				background: "red"
			}}
			></span>
		</span>
	)
}

(async () => {
	const username = await window.sleezzi.awaitForElement("#profile-header-title-container-name");
	createRoot(username.parentElement!).render(
		<>
			<span id="profile-header-title-container-name" className="text-heading-large min-width-0 text-truncate-end text-no-wrap">Sleezzi</span>
			<Icon />
		</>
	);
})();