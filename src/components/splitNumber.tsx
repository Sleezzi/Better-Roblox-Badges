import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

async function splitNumber(number: number | string) {
	const settings = await browser.storage.local.get("number-split");
	
	if (!settings["number-split"] || settings["number-split"] === "off") return `${number}`;
	
	return `${number}`.replace(/\B\B(?=([0-9]{3})+(?![0-9]))/g, settings["number-split"] === "dot" ? "." : " ");
}
export default splitNumber;


export function NumberComposent({ number }: { number: string | number }) {
	const [splitedNumber, setSplitedNumber] = useState<string | null>(null);

	useEffect(() => {
		splitNumber(number).then((_number) => setSplitedNumber(_number));
	}, [number]);

	return (<>{splitedNumber || number}</>);
}