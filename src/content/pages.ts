/**
 * All regexes will be preceded by `^https:\/\/(www\.)?roblox\.com\/`.
 * All `.tsx` and `.ts` files will be compiled into `.js`.
 */

const pages: { url: RegExp[], js: string[], css: string[] }[] = [
	{ // Games
		url: [
			/games/,
			/.*\/games/
		],
		css: [ "/assets/css/games/styles.css" ],
		js: [ "/content/games/Games.js" ]
	},
	{ // Custom page
		url: [ /better-badges\/?$/ ],
		css: [ "/assets/css/custom/404-remover.css", "/assets/css/custom/settings.css" ],
		js: [ "/content/custom/Settings.js" ],
	},
	{ // Custom page. Here is the user's friend list.
		url: [ /better-badges\/[0-9]{1,}\/?$/ ],
		css: [ "/assets/css/custom/friends.css", "/assets/css/custom/404-remover.css" ],
		js: [ "/content/custom/Friends.js" ],
	},
	{ // Custom page. Here are the badges of the friend the user has chosen.
		url: [ /better-badges\/[0-9]{1,}\/[0-9]{1,}\/?$/ ],
		css: [ "/assets/css/games/styles.css", "/assets/css/custom/404-remover.css" ],
		js: [ "/content/custom/Badges.js" ],
	},
	{ // Modifies the user's Roblox settings page.
		url: [ /my\/account/ ],
		css: [],
		js: [ "/content/settings/Select.js" ],
	},
	{ // Injected into all pages
		url: [ /.*/ ],
		css: [ "/assets/css/global/styles.css" ],
		js: [ "/content/global/Notifications.js" ],
	},
];

export default pages;