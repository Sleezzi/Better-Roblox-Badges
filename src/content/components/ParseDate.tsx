import { useEffect, useState } from "react";

function ParseDate({ date }: { date: string | number | Date }) {
	const [result, setResult] = useState("");
	
	useEffect(() => {
		window.sleezzi.parseDate(date).then((res) => setResult(res));
	}, [date]);

	return result;
}

export default ParseDate;