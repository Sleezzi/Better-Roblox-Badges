import browser from "webextension-polyfill";
import parseDate from "./parseDate";

async function Console(message: string) {
	const save = await browser.storage.local.get("logs");
	
	const logs: string[] = save.logs as any || [];
	
	await browser.storage.local.set({ "logs": [`[${await parseDate(new Date())}] ${message}`, ...logs].slice(0, 50) });
}

export default Console;