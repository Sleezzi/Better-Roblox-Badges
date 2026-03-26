interface Sleezzi {
	translate: (messageName: string, substitutions?: string | string[]) => string;
	extension: () => {
		id: string;
		icons: {
			128: string;
			48: string;
			32: string;
			16: string;
		};
		name: string;
	},
	getIcon: (name: string) => string;
}

interface Window {
	sleezzi: {
		random: () => string;
		splitNumber: (number: string | number) => string;
		parseDate: (date: string | number | Date) => Promise<string>;
		api: <API extends keyof Sleezzi>(api: API, ...args: Parameters<Sleezzi[API]>) => Promise<ReturnType<Sleezzi[API]>>;
		translate: (messageName: string, substitutions?: string | string[]) => Promise<string>;
		language: string;
		awaitForElement: <ElementType extends keyof HTMLElementTagNameMap>(element: string) => Promise<ElementType extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[ElementType] : Element>;
		userId: () => Promise<string | null>;
		components: {
			createSelect: (options?: { [text: string]: string }, name?: string) => [HTMLDivElement, HTMLSelectElement];
			createSwitch: (toggled: (state: "on" | "off") => void) => {
				button: HTMLButtonElement;
				enable: () => void;
				toggle: () => void;
			}
		}
		roblox: {
			user: {
				detail: (id: string | number) => Promise<{
					id: number;
					displayName: string;
					name: string;
					description: string;
					created: string;
					externalAppDisplayName: null | string;
					hasVerifiedBadge: boolean;
					isBanned: boolean;
				}>
				avatar: {
					headshot: (
						size: 48 | 50 | 60 | 75 | 100 | 110 | 150 | 180 | 352 | 420 | 720,
						format: "png" | "jpeg" | "webp",
						userIds: string[] | number[]
					) => Promise<{
						[id: number]: string;
					}>
				}
			}
		}
	}
}

type Message = MessageEvent<{
	[Request in keyof Sleezzi]: {
		type: "request" | "response",
		request: Request,
		id: string,
		args: Parameters<Sleezzi[Request]>
	}
}[keyof Sleezzi]>;