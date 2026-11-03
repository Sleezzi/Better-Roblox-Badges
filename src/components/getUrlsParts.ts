export const LOCALE = /[a-z]{2,3}(-[a-z]{2,4})?/;

/**
 * Returns the path segments without the locale prefix.
 * `/fr/games/123/name` -> ["games", "123", "name"]
 */
export default function getUrlParts(href: string = location.href): string[] {
	const parts = new URL(href).pathname.split("/").filter(Boolean);
	if (parts.length > 0 && new RegExp(`^${LOCALE.source}$`).test(parts[0])) parts.shift();
	return parts;
}