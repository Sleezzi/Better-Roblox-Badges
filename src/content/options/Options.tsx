import { useEffect, useState } from "react";
import Select from "../components/Select";
import ParseDate from "../components/ParseDate";
import Switch from "../components/Switch";

import { createRoot } from "react-dom/client";
import Loading from "../components/Loading";

const localesToGet = [
	"options_back",
	"options_basic",
	"options_date_small_us",
	"options_date_small_default",
	"options_date_full_us",
	"options_date_full_default",
	"options_dates_format",
	"options_split_number_off",
	"options_split_number_dot",
	"options_split_number_space",
	"options_split_number",
	"options_load_all_badges"
];

function Options() {
	const [date, setDate] = useState(Date.now());
	const [locales, setLocales] = useState<{ [name: string]: string }>({});

	const [developperAvatar, setDevelopperAvatar] = useState<string | null>(null);
	const id = "3100004179";

	useEffect(() => {
		for (const locale of localesToGet) {
			window.sleezzi.translate(locale).then((value) => setLocales((old) => ({...old, [locale]: value})));
		}
	}, []);

	useEffect(() => {
		window.sleezzi.roblox.user.avatar.headshot(180, "png", [id])
		.then((avatars) => setDevelopperAvatar(avatars[id]));
	}, []);

	return (
		<div className="row page-content new-username-pwd-rule" id="user-account">
			<div id="react-user-account-base">
				<h1>Better Roblox Badges</h1>
				<div id="settings-container">
					<div className="settings-left-navigation">
						<ul className="menu-vertical" role="tablist">
							<li className="menu-option" role="tab">
								<a href="/my/account#!/info" className="menu-option-content">
									<span className="font-caption-header">{locales.options_back || "Back"}</span>
								</a>
							</li>
							<li className="menu-option" role="tab">
								<a href="/my/account?page=better-roblox-badges" className="menu-option-content active">
									<span className="font-caption-header">{locales.options_basic || "Basic"}</span>
								</a>
							</li>
						</ul>
						<div className="tab-content rbx-tab-content">
							<div role="tabpanel" className="tab-pane active">
								<div>
									<div id="options_basic" className="setting-section">
										<div className="container-header">
											<h2 className="setting-section-header"></h2>
										</div>
										<Select
											name={locales.options_dates_format || "Date format"}
											options={[
												{
													text: locales.options_date_small_us || "American, reduced",
													value: "small_us"
												},
												{
													text: locales.options_date_small_default || "Default, reduced",
													value: "small_default"
												},
												{
													text: locales.options_date_full_us || "Americain, full",
													value: "full_us"
												},
												{
													text: locales.options_date_full_default || "Default, full",
													value: "full_default"
												}
											]}
											selectProps={{
												onChange: (e: any) => {
													if (e.target.value === "small_us") {
														localStorage.setItem("dateFormat", "American/Small");
													}
													if (e.target.value === "small_default") {
														localStorage.setItem("dateFormat", "Default/Small");
													}
													if (e.target.value === "full_us") {
														localStorage.setItem("dateFormat", "American/Full");
													}
													if (e.target.value === "full_default") {
														localStorage.setItem("dateFormat", "Default/Full");
													}
													setDate(Date.now());
												},
												defaultValue: (() => {
													if (localStorage.getItem("dateFormat") === "American/Small") {
														return "small_us";
													}
													if (localStorage.getItem("dateFormat") === "Default/Small") {
														return "small_default";
													}
													if (localStorage.getItem("dateFormat") === "American/Full") {
														return "full_us";
													}
													return "full_default";
												})()
											}}
										/>
										<p><ParseDate date={date} /></p>
									</div>
									<div id="split_number" className="setting-section">
										<div className="container-header">
											<h2 className="setting-section-header"></h2>
										</div>
										<Select
											name={locales.options_split_number || "Split numbers by"}
											options={[
												{
													text: locales.options_split_number_off || "Nothing",
													value: "off"
												},
												{
													text: locales.options_split_number_dot || "Dot",
													value: "dot"
												},
												{
													text: locales.options_split_number_space || "Space",
													value: "space"
												}
											]}
											selectProps={{
												defaultValue: localStorage.getItem("splitNumber") || "off",
												onChange: (e: any) => {
													if (e.target.value === "off") {
														localStorage.removeItem("splitNumber");
													}
													if (e.target.value === "dot") {
														localStorage.setItem("splitNumber", "dot");
													}
													if (e.target.value === "space") {
														localStorage.setItem("splitNumber", "space");
													}
												}
											}}
										/>
									</div>
									<div id="load_all_badges" className="setting-section">
										<div className="container-header">
											<h2 className="setting-section-header"></h2>
										</div>
										<label htmlFor="">{locales.options_load_all_badges || "Load all badges automatically"}</label>
										<Switch defaultState={!!localStorage.getItem("loadAllBadges")} toggled={(state) => {
											if (state) {
												localStorage.setItem("loadAllBadges", "true");
											} else {
												localStorage.removeItem("loadAllBadges");
											}
										}} />
									</div>
								</div>
							</div>
							<div style={{height: "5rem"}}></div>
						</div>
					</div>
				</div>
				<div id="developper-section">
					{
						developperAvatar ?
						<img src={developperAvatar} alt="Sleezzi" className="avatar" />
						:
						<Loading className="avatar" />
					}
					<div className="metadata">
						<h1>Sleezzi</h1>
						<div className="links">
							<a href="https://github.com/Sleezzi/Better-Roblox-Badges" target="_blank" style={{["--color" as "color"]: "white"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
							</a>
							<a href="mailto:contact@sleezzi.fr" target="_blank" style={{["--color" as "color"]: "aqua"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
							</a>
							<a href="https://fast.sleezzi.fr/stripe" target="_blank" style={{["--color" as "color"]: "green"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
							</a>
							<a href="https://chromewebstore.google.com/detail/better-roblox-badges/giaoglbhnfadcjompceiajfkmbghdkeg/reviews" target="_blank" style={{["--color" as "color"]: "yellow"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
							</a>
							<a href={`https://www.roblox.com/users/${id}/profile`} target="_blank" style={{["--color" as "color"]: "blue"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

(async () => {
	const page = await window.sleezzi.awaitForElement<"div">("#content");
	if (!page) return;
	page.innerHTML = "";

	createRoot(page).render(<Options />);
})();