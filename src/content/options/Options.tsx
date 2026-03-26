import { useEffect, useState } from "react";
import Select from "../components/Select";
import ParseDate from "../components/ParseDate";
import Switch from "../components/Switch";

import { createRoot } from "react-dom/client";

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

	useEffect(() => {
		for (const locale of localesToGet) {
			window.sleezzi.translate(locale).then((value) => setLocales((old) => ({...old, [locale]: value})));
		}
	}, []);

	return (
		<div className="row page-content new-username-pwd-rule" id="user-account">
			<div id="react-user-account-base">
				<h1></h1>
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