import { useEffect, useState } from "react";
import Select from "../../components/react/Select";
import ParseDate from "../../components/parseDate";

import { createRoot } from "react-dom/client";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
import getAvatar from "../../components/api/user/getAvatar";
import awaitForElement from "../../components/awaitForElement";
import getIcon from "../../components/getIcon";
import extension from "../../components/extension";
import browser from "webextension-polyfill";
import Notify from "../global/Notifications";
import Console from "../../components/console";
import Icon from "../../components/react/Icon";

const localesToGet = [
	"name",
	"options_title",
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
	"options_load_all_badges",
	"options_settings_saved",
	"options_settings_saved_message",
];

interface Settings {
	date_format?: "small_us" | "small_default" | "full_us" | "full_default",
	number_split?: "off" | "dot" | "space"
}

function Options() {
	const [date, setDate] = useState("");
	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	const [settings, setSettings] = useState<Settings | null>(null);

	const [developperAvatar, setDevelopperAvatar] = useState<string | null>(null);

	const [logs, setLogs] = useState<string[] | null>(null);

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	useEffect(() => {
		if (developperAvatar) return;
		getAvatar(180, "png", [extension.author.roblox])
		.then((avatars) => setDevelopperAvatar(avatars[Number(extension.author.roblox)]))
		.catch(async (err) => {
			console.error(err);
			await Console(`Failed to retreive developper's avatar - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, []);


	useEffect(() => {
		browser.storage.local.get(["date-format","number-split","logs"]).then((save: any) => {
			setSettings({
				date_format: save["date-format"] || "full_default",
				number_split: save["number-split"] || "off",
			});
			if (typeof save.logs !== "string") return setLogs([]);
			const savedLogs = JSON.parse(save.logs);
			if (!savedLogs) return setLogs([]);
			
			setLogs(savedLogs);
		});
		
		const onUpdated = (changes: browser.Storage.StorageAreaOnChangedChangesType) => {
			if ("logs" in changes) {
				setLogs(changes.logs.newValue as any || []);
				return;
			}
			if ("date-format" in changes) {
				setSettings((old) => ({...old, date_format: changes["date-format"].newValue as any }));
			}
			if ("number-split" in changes) {
				setSettings((old) => ({...old, number_split: changes["number-split"].newValue as any }));
			}
			Notify(locales.options_settings_saved || "Saved", locales.options_settings_saved_message || "The settings have been updated.");
		}
		browser.storage.local.onChanged.addListener(onUpdated);
		
		return () => {
			browser.storage.local.onChanged.removeListener(onUpdated);
		};
	}, []);

	useEffect(() => {
		ParseDate(Date.now()).then((d) => setDate(d));
	}, [settings]);

	return (
		<>
			<h1>{locales.name || "Better Roblox Badges"}</h1>
			<div id="settings-container">
				<ul className="menu-vertical" role="tablist">
					<li className="menu-option" role="tab">
						<a href="/my/account#!/info" className="menu-option-content">
							<span className="font-caption-header">{locales.options_back || "Back"}</span>
						</a>
					</li>
					<li className="menu-option" role="tab">
						<a href="/better-badges" className="menu-option-content active">
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
								{
									settings ?
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
												if (!settings) return;
												browser.storage.local.set({
													"date-format": e.target.value,
												});
											},
											value: settings.date_format
										}}
									/>
									:
									<Loading style={{ height: "2.25rem", width: "100%" }} />
								}
								<p>{date}</p>
							</div>
							<div id="split_number" className="setting-section">
								<div className="container-header">
									<h2 className="setting-section-header"></h2>
								</div>
								{
									settings ?
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
											value: settings.number_split || "off",
											onChange: (e: any) => {
												if (!settings) return;
												browser.storage.local.set({
													"number-split": e.target.value,
												});
											}
										}}
									/>
									:
									<Loading style={{ height: "2.25rem", width: "100%" }} />
								}
							</div>
						</div>
					</div>
					<div style={{height: "5rem"}}></div>
				</div>
			</div>
			<div id="developper-section">
				{
					developperAvatar ?
					<a href={`https://www.roblox.com/users/${extension.author.roblox}/profile`}>
						<img src={developperAvatar} alt={extension.author.name} className="avatar" />
					</a>
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
							<span style={{"color": "aqua", "mask": `url(${getIcon("at-sign.png")})`}}></span>
						</a>
						<a href="https://sleezzi.fr/stripe" target="_blank">
							<span style={{"color": "green", "mask": `url(${getIcon("badge-dollar-sign.png")})`}}></span>
						</a>
						<a href="https://chromewebstore.google.com/detail/better-roblox-badges/giaoglbhnfadcjompceiajfkmbghdkeg/reviews" target="_blank">
							<span style={{"color": "yellow", "mask": `url(${getIcon("star.png")})`}}></span>
						</a>
						<a href={`https://www.roblox.com/users/${extension.author.roblox}/profile`} target="_blank">
							<span style={{"color": "blue", "mask": `url(${getIcon("user.png")})`}}></span>
						</a>
					</div>
				</div>
			</div>
			<div id="logs-section">
				{
					logs && logs.length > 0 && <button onClick={() => {
						const content = logs.join("\n");
						const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
						const url = URL.createObjectURL(blob);

						const a = document.createElement("a");
						a.href = url;
						a.download = `${new Date().toDateString()}.log`;
						a.target = "_blank";
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);
					}}>
						<Icon icon="arrow-down-to-line.png" color="currentColor" />
					</button>
				}
				{
					logs && logs.length === 0 && <i>There are no logs.</i>
				}
				{
					logs ?
					logs.map((log, index) => (<span key={index}>{log}</span>))
					:
					<>
						<Loading style={{ height: "1rem", width: "90%" }} />
						<Loading style={{ height: "1rem", width: "95%" }} />
						<Loading style={{ height: "1rem", width: "70%" }} />
						<Loading style={{ height: "1rem", width: "67%" }} />
						<Loading style={{ height: "1rem", width: "36%" }} />
						<Loading style={{ height: "1rem", width: "96%" }} />
						<Loading style={{ height: "1rem", width: "86%" }} />
					</>
				}
			</div>
		</>
	);
}

(async () => {
	const parent = await awaitForElement<"div">("#content");
	if (!parent) return;

	if (parent.querySelector("#better-badges-custom-settings-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-custom-settings-container";
	
	createRoot(container).render(<Options  />);
	parent.appendChild(container);
})();