import { useEffect, useState } from "react";
import Select from "../../components/react/Select";
import ParseDate from "../../components/parseDate";
import Switch from "../../components/react/Switch";

import { createRoot } from "react-dom/client";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
import getAvatar from "../../components/api/user/getAvatar";
import awaitForElement from "../../components/awaitForElement";
import getIcon from "../../components/getIcon";

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
	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	const [developperAvatar, setDevelopperAvatar] = useState<string | null>(null);
	const id = "3100004179";

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	useEffect(() => {
		getAvatar(180, "png", [id])
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
										<p>{ParseDate(date)}</p>
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
							<a href="https://github.com/Sleezzi/Better-Roblox-Badges" target="_blank">
								<span style={{"mask": `url(${getIcon("code.png")})`}}></span>
							</a>
							<a href="mailto:contact@sleezzi.fr" target="_blank">
								<span style={{["--color" as "color"]: "aqua", "mask": `url(${getIcon("at-sign.png")})`}}></span>
							</a>
							<a href="https://fast.sleezzi.fr/stripe" target="_blank">
								<span style={{["--color" as "color"]: "green", "mask": `url(${getIcon("badge-dollar-sign.png")})`}}></span>
							</a>
							<a href="https://chromewebstore.google.com/detail/better-roblox-badges/giaoglbhnfadcjompceiajfkmbghdkeg/reviews" target="_blank">
								<span style={{["--color" as "color"]: "yellow", "mask": `url(${getIcon("star.png")})`}}></span>
							</a>
							<a href={`https://www.roblox.com/users/${id}/profile`} target="_blank">
								<span style={{["--color" as "color"]: "blue", "mask": `url(${getIcon("user.png")})`}}></span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

(async () => {
	const page = await awaitForElement<"div">("#content");
	if (!page) return;
	
	createRoot(page).render(<Options />);
})();