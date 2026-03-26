/// <reference path="../../../types/Window.d.ts" />

const requests: {
	[id: string]: (...args: any[]) => void
} = {};

const sendMessage = <Request extends keyof Sleezzi>(request: Request, ...args: Parameters<Sleezzi[Request]>) => new Promise<ReturnType<Sleezzi[Request]>>((resolve) => {
	const id = window.sleezzi.random();
	requests[id] = resolve;
	window.postMessage({ type: "request", request: request, args: args, id }, "*");
});

window.addEventListener("message" as any, (event: Message) => {
	if (event.source !== window) return;
	if (event.data.type !== "response") return;
	const request = requests[event.data.id];
	if (!request) return;
	request(event.data.args);
	delete requests[event.data.id];
});

window.sleezzi = {
	awaitForElement: (element) => new Promise((resolve, error) => {
		let resolved = false;
		if (document.querySelector(element)) {
			resolve(document.querySelector(element) as any);
			return;
		}
		
		const onChange = () => {
			if (document.querySelector(element)) {
				resolved = true;
				resolve(document.querySelector(element) as any);
				return;
			}
		}
		const osberver = new MutationObserver(onChange);
		osberver.observe(document.body, {
			subtree: true,
			childList: true
		});
		setTimeout(() => {
			if (resolved) return;
			error("Timeout");
		}, 10_000);
	}),
	userId: async () => {
		const element = await window.sleezzi.awaitForElement<"a">("#right-navigation-header .age-bracket-label.text-header a");
		if (!element) return null;
		if (element.href.split("/")[4] === "users") {
			return element.href.split("/")[5];
		}
		return element.href.split("/")[4];
	},
	parseDate: async (date: number | string | Date) => {
		const _date = new Date(date);
		const format = localStorage.getItem("dateFormat");
		const day = await sleezzi.translate("day");
		const month = await sleezzi.translate("month");

		if (format === "American/Small") {
			return `${_date.getMonth() < 9 ? `0${_date.getMonth()}` : _date.getMonth()}/${_date.getDate() < 9 ? `0${_date.getDate()}` : _date.getDate()}/${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
		}
		if (format === "Default/Small") {
			return `${_date.getDate() < 9 ? `0${_date.getDate()}` : _date.getDate()}/${_date.getMonth() < 9 ? `0${_date.getMonth()}` : _date.getMonth()}/${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
		}
		if (format === "American/Full") {
			return `${day.split("/", 7)[_date.getDay()]} ${month.split("/", 12)[_date.getMonth()]} ${_date.getDate()} ${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
		}
		return `${day.split("/", 7)[_date.getDay()]} ${_date.getDate()} ${month.split("/", 12)[_date.getMonth()]} ${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;;
	},
	random: () => Math.random().toString(36).slice(2),
	splitNumber: (number) => {
		if (!localStorage.getItem("splitNumber")) return `${number}`;
		return `${number}`.replace(/\B\B(?=([0-9]{3})+(?![0-9]))/g, localStorage.getItem("splitNumber") === "dot" ? "." : " ");
	},
	language: document.querySelector("html")!.lang,
	translate: (message: string) => window.sleezzi.api("translate", message),
	roblox: {
		user: {
			detail: async (id: string | number) => {
				const raw = await fetch(`https://users.roblox.com/v1/users/${id}`);
				const response: {
					id: number;
					displayName: string;
					name: string;
					description: string;
					created: string;
					externalAppDisplayName: null | string;
					hasVerifiedBadge: boolean;
					isBanned: boolean;
				} = await raw.json();
				return response;
			},
			avatar: {
				headshot: (size = 48, format = "png", userIds) => new Promise(async (resolve, error) => {
					const avatars: { [id: number]: string } = {};
					let index = 0;
					const get = async () => {
						const raw = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.slice(index, index + 100).join(",")}&format=${format}&size=${size}x${size}`);
						const response: {
							data: {
								targetId: number,
								state: string,
								imageUrl: string,
								version: string
							}[]
						} = await raw.json();
						for (const user of response.data) {
							avatars[user.targetId] = user.imageUrl;
						}
						if (userIds.slice(index + 100, index + 100).length > 0) {
							index += 100;
							await get();
						}
					}
					await get();
					resolve(avatars);
				})
			}
		}
	},
	api: (api, ...args) => new Promise((resolve) => {
		const id = window.sleezzi.random();
		requests[id] = resolve;
		window.postMessage({ type: "request", request: api, args: args, id }, "*");
	}),
	components: {
		createSelect: (options = {}, name = "") => {
			const id = window.sleezzi.random();
			const container = document.createElement("div");
			container.className = "select-group";

			const label = document.createElement("label");
			label.innerText = name;
			label.className = "select-label text-label";
			label.setAttribute("for", id);
			container.appendChild(label);

			const selectContainer = document.createElement("div");
			selectContainer.className = "rbx-select-group select-group";
			container.appendChild(selectContainer);

			const select = document.createElement("select");
			select.className = "input-field rbx-select select-option";
			select.id = id;
			selectContainer.appendChild(select);
			
			for (const [value, text] of Object.entries(options)) {
				const option = document.createElement("option");
				option.innerText = text;
				option.value = value
				select.appendChild(option);
			}

			const span = document.createElement("span");
			span.className = "icon-arrow icon-down-16x16";
			selectContainer.appendChild(span);
			return [container, select];
		},
		createSwitch: (toggled) => {
			const button = document.createElement("button");
			button.type = "button";
			button.role = "switch";
			button.className = "btn-toggle receiver-destination-type-toggle";

			const toggleFlip = document.createElement("span");
			toggleFlip.className = "toggle-flip";
			button.appendChild(toggleFlip);
			
			const toggleOn = document.createElement("span");
			toggleOn.className = "toggle-on";
			toggleOn.id = "toggle-on";
			button.appendChild(toggleOn);

			const toggleOff = document.createElement("span");
			toggleOff.className = "toggle-off";
			toggleOff.id = "toggle-off";
			button.appendChild(toggleOff);
			
			const enable = () => {
				if (button.classList.contains("on")) {
					return;
				}
				button.classList.add("on");
				button.setAttribute("aria-checked", "true");
			}
			const disable = () => {
				if (!button.classList.contains("on")) {
					return;
				}
				button.classList.remove("on");
				button.setAttribute("aria-checked", "false");
			}

			const toggle = () => {
				if (button.classList.contains("on")) {
					disable();
				} else {
					enable();
				}
			}

			button.onclick = () => {
				toggle();
				toggled(button.classList.contains("on") ? "on" : "off");
			}

			return {
				button: button,
				enable: enable,
				toggle: toggle
			}
		}
	}
};